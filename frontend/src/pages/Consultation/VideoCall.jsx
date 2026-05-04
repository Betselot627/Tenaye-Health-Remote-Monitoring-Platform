/**
 * VideoCall.jsx — WebRTC video consultation page
 *
 * Flow:
 * 1. Patient/Doctor arrives here from their Appointments page
 * 2. Page connects to Socket.IO signaling server
 * 3. WebRTC peer connection is established between patient and doctor
 * 4. rPPG runs in background on patient's local video stream
 * 5. Either party can end the call → navigates back to appointments
 *
 * Socket events used (matches server.js):
 *   emit:   join-room, offer, answer, ice-candidate, end-call
 *   listen: user-joined, offer, answer, ice-candidate, call-ended
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
const STUN = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// ─── rPPG heart-rate estimator (runs on main thread for simplicity) ───────────
// Samples the mean green channel of the forehead ROI every frame,
// then estimates BPM from the dominant frequency using a simple DFT.
class RPPGEstimator {
  constructor() {
    this.buffer = [];
    this.SAMPLE_RATE = 15; // fps target
    this.MIN_SAMPLES = this.SAMPLE_RATE * 15; // 15 seconds
    this.MAX_SAMPLES = this.SAMPLE_RATE * 30; // 30-second window
  }

  addFrame(imageData, width, height) {
    // Forehead ROI: top-centre 40% × 25% of frame
    const x0 = Math.floor(width * 0.3);
    const x1 = Math.floor(width * 0.7);
    const y0 = Math.floor(height * 0.1);
    const y1 = Math.floor(height * 0.35);
    let sum = 0, count = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        sum += imageData[(y * width + x) * 4 + 1]; // green channel
        count++;
      }
    }
    this.buffer.push(sum / count);
    if (this.buffer.length > this.MAX_SAMPLES) this.buffer.shift();
  }

  estimate() {
    if (this.buffer.length < this.MIN_SAMPLES) return null;
    const sig = this._bandPass(this.buffer);
    const bpm = this._peakFreq(sig, this.SAMPLE_RATE) * 60;
    const confidence = this._confidence(this.buffer);
    const progress = Math.min(100, Math.round((this.buffer.length / this.MIN_SAMPLES) * 100));
    return { bpm: Math.round(bpm), confidence, progress };
  }

  _bandPass(signal) {
    // Simple IIR: high-pass (remove drift) + low-pass (remove noise)
    const hpA = 0.95, lpA = 0.15;
    let hpPrev = 0, sigPrev = signal[0], lpPrev = 0;
    return signal.map((s) => {
      const hp = hpA * (hpPrev + s - sigPrev);
      hpPrev = hp; sigPrev = s;
      lpPrev = lpPrev + lpA * (hp - lpPrev);
      return lpPrev;
    });
  }

  _peakFreq(signal, fs) {
    const LOW = 0.7, HIGH = 3.5, STEP = 0.05;
    let maxPow = 0, peakF = 1.2;
    for (let f = LOW; f <= HIGH; f += STEP) {
      const omega = (2 * Math.PI * f) / fs;
      let re = 0, im = 0;
      signal.forEach((v, i) => { re += v * Math.cos(omega * i); im += v * Math.sin(omega * i); });
      const pow = re * re + im * im;
      if (pow > maxPow) { maxPow = pow; peakF = f; }
    }
    return peakF;
  }

  _confidence(signal) {
    const mean = signal.reduce((a, b) => a + b, 0) / signal.length;
    const std = Math.sqrt(signal.reduce((a, b) => a + (b - mean) ** 2, 0) / signal.length);
    const cv = std / (mean || 1);
    if (cv < 0.02) return "high";
    if (cv < 0.05) return "medium";
    return "low";
  }
}

// ─── Confidence dot ────────────────────────────────────────────────────────────
function ConfidenceDot({ confidence }) {
  const colors = { high: "bg-emerald-400", medium: "bg-amber-400", low: "bg-red-400" };
  return <span className={`w-2 h-2 rounded-full ${colors[confidence] || "bg-gray-400"} animate-pulse`} />;
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function VideoCall() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  // Determine role from navigation state (patient or doctor)
  const role = state?.role || "patient";
  const appointmentId = state?.appointmentId || null;
  const doctorName = state?.doctorName || "Doctor";
  const patientName = state?.patientName || "Patient";

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const rppgRef = useRef(new RPPGEstimator());
  const rppgCanvasRef = useRef(document.createElement("canvas"));
  const rppgTimerRef = useRef(null);

  // State
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [rppg, setRppg] = useState({ bpm: null, confidence: null, progress: 0 });
  const [ending, setEnding] = useState(false);
  const [remoteJoined, setRemoteJoined] = useState(false);

  // Prescription modal state (doctor only)
  const [showPrescription, setShowPrescription] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: "",
    notes: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
  });
  const [savingPrescription, setSavingPrescription] = useState(false);

  // ── Call timer ──
  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  const formatDuration = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // ── rPPG frame capture (patient only) ──
  const startRPPG = useCallback(() => {
    if (role !== "patient") return;
    const canvas = rppgCanvasRef.current;
    canvas.width = 160; canvas.height = 120;
    const ctx = canvas.getContext("2d");
    rppgTimerRef.current = setInterval(() => {
      const video = localVideoRef.current;
      if (!video || video.readyState < 2) return;
      ctx.drawImage(video, 0, 0, 160, 120);
      const { data } = ctx.getImageData(0, 0, 160, 120);
      rppgRef.current.addFrame(data, 160, 120);
      const result = rppgRef.current.estimate();
      if (result) setRppg(result);
    }, 1000 / 15);
  }, [role]);

  // ── WebRTC setup ──
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        // 1. Get local media (video + audio)
        console.log("[VideoCall] Requesting camera and microphone...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 }, 
          audio: { echoCancellation: true, noiseSuppression: true } 
        });
        console.log("[VideoCall] Got local stream:", stream.getTracks().map(t => `${t.kind}:${t.enabled}`));
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          console.log("[VideoCall] Local video attached");
        }

        // 2. Connect socket
        console.log("[VideoCall] Connecting socket to:", SOCKET_URL);
        const socket = io(SOCKET_URL, { transports: ["websocket"] });
        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("[VideoCall] Socket connected:", socket.id);
        });

        // 3. Create peer connection
        const pc = new RTCPeerConnection(STUN);
        pcRef.current = pc;
        console.log("[VideoCall] Peer connection created");

        stream.getTracks().forEach((t) => {
          pc.addTrack(t, stream);
          console.log("[VideoCall] Added track to peer connection:", t.kind);
        });

        pc.ontrack = (e) => {
          console.log("[VideoCall] Received remote track:", e.track.kind, e.streams);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = e.streams[0];
            console.log("[VideoCall] Remote video attached");
          }
        };

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            console.log("[VideoCall] Sending ICE candidate");
            socket.emit("ice-candidate", { roomId, candidate: e.candidate });
          }
        };

        pc.onconnectionstatechange = () => {
          console.log("[VideoCall] Connection state:", pc.connectionState);
          if (pc.connectionState === "connected") {
            setConnected(true);
            console.log("[VideoCall] WebRTC connected!");
            startRPPG();
          }
        };

        // 4. Socket events
        socket.on("user-joined", async (peerId) => {
          console.log("[VideoCall] User joined:", peerId);
          setRemoteJoined(true);
          // Caller creates offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { roomId, offer });
          console.log("[VideoCall] Offer sent");
        });

        socket.on("offer", async ({ offer }) => {
          console.log("[VideoCall] Offer received");
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { roomId, answer });
          console.log("[VideoCall] Answer sent");
        });

        socket.on("answer", async ({ answer }) => {
          console.log("[VideoCall] Answer received");
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("ice-candidate", async ({ candidate }) => {
          try { 
            await pc.addIceCandidate(new RTCIceCandidate(candidate)); 
            console.log("[VideoCall] ICE candidate added");
          } catch (e) {
            console.error("[VideoCall] ICE candidate error:", e);
          }
        });

        socket.on("call-ended", () => {
          console.log("[VideoCall] Call ended by peer");
          if (!cancelled) endCall(false);
        });

        // 5. Join room
        console.log("[VideoCall] Joining room:", roomId);
        socket.emit("join-room", roomId);
      } catch (err) {
        console.error("[VideoCall] Init error:", err);
        alert("Failed to access camera/microphone. Please check permissions.");
      }
    };

    init();

    return () => {
      cancelled = true;
      clearInterval(rppgTimerRef.current);
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  // ── End call ──
  const endCall = useCallback(async (emitEvent = true) => {
    setEnding(true);
    clearInterval(rppgTimerRef.current);
    if (emitEvent) socketRef.current?.emit("end-call", { roomId });
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();

    // Doctor: show prescription modal before navigating
    if (role === "doctor" && appointmentId) {
      setShowPrescription(true);
      setEnding(false);
      return; // Don't navigate yet, wait for prescription
    }

    socketRef.current?.disconnect();

    // Patient navigates back immediately
    const dest = "/patient/appointments";
    navigate(dest, { state: { callEnded: true, duration: callDuration } });
  }, [roomId, role, callDuration, navigate, appointmentId]);

  // ── Add medication field ──
  const addMedication = () => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    }));
  };

  // ── Remove medication field ──
  const removeMedication = (index) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  // ── Update medication field ──
  const updateMedication = (index, field, value) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  // ── Submit prescription ──
  const submitPrescription = async () => {
    if (!appointmentId) return;

    setSavingPrescription(true);
    try {
      const token = localStorage.getItem("token");
      const patientId = state?.patientId;

      const res = await fetch(`${SOCKET_URL}/api/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId,
          appointmentId,
          medications: prescriptionData.medications.filter(m => m.name.trim()),
          diagnosis: prescriptionData.diagnosis,
          notes: prescriptionData.notes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save prescription");
      }

      // Close modal and navigate
      setShowPrescription(false);
      socketRef.current?.disconnect();
      navigate("/doctor/appointments", { state: { callEnded: true, duration: callDuration, prescriptionSaved: true } });
    } catch (error) {
      console.error("Save prescription error:", error);
      alert("Failed to save prescription. Please try again.");
    } finally {
      setSavingPrescription(false);
    }
  };

  // ── Toggle mute ──
  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setMuted(!track.enabled); }
  };

  // ── Toggle video ──
  const toggleVideo = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setVideoOff(!track.enabled); }
  };

  // ── Send chat message via socket ──
  const sendMessage = () => {
    if (!chatInput.trim() || !socketRef.current) {
      console.log("[VideoCall] Cannot send message - empty or no socket");
      return;
    }

    const msg = {
      id: Date.now(),
      text: chatInput.trim(),
      sender: role,
      senderName: role === "patient" ? patientName : doctorName,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    console.log("[VideoCall] Sending chat message:", msg);

    // Emit to other peer via socket
    socketRef.current.emit("chat-message", {
      roomId,
      message: msg,
    });

    // Add to local state (show on right side for sender)
    setMessages((prev) => [...prev, { ...msg, sender: "me" }]);
    setChatInput("");
  };

  // Listen for incoming chat messages
  useEffect(() => {
    if (!socketRef.current) return;

    const handleChatMessage = ({ message }) => {
      console.log("[VideoCall] Received chat message:", message);
      // Add to local state (show on left side for receiver)
      setMessages((prev) => [...prev, { ...message, sender: "other" }]);

      // Increment unread if chat is closed
      setUnreadCount((prev) => {
        if (!chatOpen) return prev + 1;
        return prev;
      });
    };

    socketRef.current.on("chat-message", handleChatMessage);
    console.log("[VideoCall] Chat message listener registered");

    return () => {
      socketRef.current?.off("chat-message", handleChatMessage);
    };
  }, [chatOpen]);

  const openChat = () => { setChatOpen(true); setUnreadCount(0); };

  const remoteLabel = role === "patient" ? doctorName : patientName;
  const localLabel = role === "patient" ? patientName : doctorName;

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden select-none">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
          <span className="text-white text-sm font-semibold">
            {connected ? "Connected" : remoteJoined ? "Connecting..." : "Waiting for other party..."}
          </span>
        </div>
        {connected && (
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-white text-sm">timer</span>
            <span className="text-white text-sm font-mono font-bold">{formatDuration(callDuration)}</span>
          </div>
        )}
        <div className="text-gray-400 text-xs font-mono">Room: {roomId}</div>
      </div>

      {/* ── Video area ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Remote video (full screen) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Waiting overlay */}
        {!connected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <div className="w-24 h-24 rounded-full bg-[#7B2D8B]/30 flex items-center justify-center mb-4 animate-pulse">
              <span className="material-symbols-outlined text-[#7B2D8B] text-5xl">person</span>
            </div>
            <p className="text-white font-bold text-lg">{remoteLabel}</p>
            <p className="text-gray-400 text-sm mt-1">
              {remoteJoined ? "Setting up connection..." : "Waiting to join..."}
            </p>
            <div className="flex gap-1 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 bg-[#7B2D8B] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Remote name overlay */}
        {connected && (
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-white text-sm">person</span>
            <span className="text-white text-sm font-semibold">{remoteLabel}</span>
          </div>
        )}

        {/* Local video (picture-in-picture) */}
        <div className="absolute top-4 right-4 w-32 h-44 md:w-40 md:h-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {videoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-400 text-2xl">videocam_off</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <span className="text-white text-[10px] font-bold bg-black/50 px-1.5 py-0.5 rounded-full truncate">{localLabel}</span>
            {muted && <span className="material-symbols-outlined text-red-400 text-sm">mic_off</span>}
          </div>
        </div>

        {/* ── rPPG vitals indicator (patient only, shown to both) ── */}
        {role === "patient" && (
          <div className="absolute top-4 left-4">
            {rppg.progress < 100 ? (
              <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-2">
                <div className="w-4 h-4 relative">
                  <svg className="w-4 h-4 -rotate-90" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    <circle
                      cx="8" cy="8" r="6" fill="none" stroke="#7B2D8B" strokeWidth="2"
                      strokeDasharray={`${(rppg.progress / 100) * 37.7} 37.7`}
                    />
                  </svg>
                </div>
                <span className="text-white text-xs font-semibold">Measuring vitals...</span>
              </div>
            ) : (
              <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-2">
                <ConfidenceDot confidence={rppg.confidence} />
                <span className="material-symbols-outlined text-pink-400 text-sm">monitor_heart</span>
                <span className="text-white text-sm font-black">{rppg.bpm} BPM</span>
                {rppg.confidence === "low" && (
                  <span className="text-amber-300 text-[10px]">Keep still</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Doctor vitals panel (doctor role) ── */}
        {role === "doctor" && rppg.bpm && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm p-3 rounded-2xl min-w-35">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Patient Vitals</p>
            <div className="flex items-center gap-2">
              <ConfidenceDot confidence={rppg.confidence} />
              <span className="material-symbols-outlined text-pink-400 text-sm">monitor_heart</span>
              <span className="text-white text-lg font-black">{rppg.bpm}</span>
              <span className="text-gray-400 text-xs">BPM</span>
            </div>
            {(rppg.bpm < 40 || rppg.bpm > 150) && (
              <div className="mt-2 bg-red-500/30 border border-red-500/50 rounded-lg px-2 py-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-red-400 text-xs animate-pulse">emergency</span>
                <span className="text-red-300 text-[10px] font-bold">Critical HR</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Controls bar ── */}
      <div className="bg-black/60 backdrop-blur-sm px-6 py-4 flex items-center justify-center gap-4">

        {/* Chat */}
        <button
          onClick={openChat}
          className="relative w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
        >
          <span className="material-symbols-outlined text-white text-2xl">chat</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Toggle video */}
        <button
          onClick={toggleVideo}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 ${videoOff ? "bg-red-500/80 hover:bg-red-500" : "bg-white/10 hover:bg-white/20"}`}
        >
          <span className="material-symbols-outlined text-white text-2xl">
            {videoOff ? "videocam_off" : "videocam"}
          </span>
        </button>

        {/* Toggle mute */}
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 ${muted ? "bg-red-500/80 hover:bg-red-500" : "bg-white/10 hover:bg-white/20"}`}
        >
          <span className="material-symbols-outlined text-white text-2xl">
            {muted ? "mic_off" : "mic"}
          </span>
        </button>

        {/* End call */}
        <button
          onClick={() => endCall(true)}
          disabled={ending}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-900/50 disabled:opacity-60"
        >
          {ending ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-white text-2xl">call_end</span>
          )}
        </button>
      </div>

      {/* ── Chat panel ── */}
      {chatOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-sm flex flex-col border-l border-white/10 z-20">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-white font-bold">In-call Chat</h3>
            <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-gray-500 text-sm text-center mt-8">No messages yet</p>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${msg.sender === "me" ? "bg-[#7B2D8B] text-white rounded-br-sm" : "bg-white/10 text-white rounded-bl-sm"}`}>
                  <p>{msg.text}</p>
                  <p className="text-[10px] opacity-60 mt-0.5 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/10 flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 text-white placeholder-gray-500 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B2D8B]"
            />
            <button
              onClick={sendMessage}
              disabled={!chatInput.trim()}
              className="w-9 h-9 bg-[#7B2D8B] rounded-xl flex items-center justify-center hover:bg-[#9d3fb0] transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-white text-lg">send</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Prescription Modal (Doctor only after call) ── */}
      {showPrescription && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D7377] to-[#14A085] p-6 text-white">
              <h2 className="text-xl font-black flex items-center gap-2">
                <span className="material-symbols-outlined">medication</span>
                Write Prescription
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Patient: {patientName} | Call Duration: {formatDuration(callDuration)}
              </p>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={prescriptionData.diagnosis}
                  onChange={(e) => setPrescriptionData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="Enter diagnosis..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D7377]"
                />
              </div>

              {/* Medications */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">Medications</label>
                  <button
                    onClick={addMedication}
                    className="text-sm text-[#0D7377] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Medication
                  </button>
                </div>

                <div className="space-y-3">
                  {prescriptionData.medications.map((med, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <input
                          type="text"
                          placeholder="Medication name"
                          value={med.name}
                          onChange={(e) => updateMedication(index, "name", e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D7377]"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g., 500mg)"
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D7377]"
                        />
                        <input
                          type="text"
                          placeholder="Frequency (e.g., 2x daily)"
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D7377]"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., 7 days)"
                          value={med.duration}
                          onChange={(e) => updateMedication(index, "duration", e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D7377]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Special instructions (e.g., Take after food)"
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0D7377]"
                      />
                      {prescriptionData.medications.length > 1 && (
                        <button
                          onClick={() => removeMedication(index)}
                          className="mt-2 text-red-500 text-xs font-semibold flex items-center gap-1 hover:underline"
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  value={prescriptionData.notes}
                  onChange={(e) => setPrescriptionData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional instructions or notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D7377] resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowPrescription(false);
                  socketRef.current?.disconnect();
                  navigate("/doctor/appointments", { state: { callEnded: true, duration: callDuration } });
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Skip & Close
              </button>
              <button
                onClick={submitPrescription}
                disabled={savingPrescription || !prescriptionData.medications.some(m => m.name.trim())}
                className="flex-1 py-3 bg-gradient-to-r from-[#0D7377] to-[#14A085] text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingPrescription ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    Save Prescription
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
