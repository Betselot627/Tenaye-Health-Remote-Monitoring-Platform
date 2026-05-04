import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "./components/PatientLayout";
import { getMyAppointments } from "../../services/patientService";

// ─── Cancel confirmation modal ─────────────────────────────────────────────────
function CancelModal({ apt, onConfirm, onClose }) {
  const hoursUntil = apt
    ? (() => {
        // Properly convert 12-hour time to 24-hour for Date parsing
        const [time, period] = apt.time.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        const aptDate = new Date(`${apt.date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
        return Math.floor((aptDate - new Date()) / 36e5);
      })()
    : 0;
  const eligible = hoursUntil >= 24;

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${eligible ? "bg-amber-50" : "bg-red-50"}`}>
          <span className={`material-symbols-outlined text-2xl ${eligible ? "text-amber-500" : "text-red-500"}`}>
            {eligible ? "event_busy" : "warning"}
          </span>
        </div>
        <h3 className="text-lg font-black text-gray-800 mb-1">Cancel Appointment?</h3>
        <p className="text-sm text-gray-500 mb-4">
          {apt?.doctor} · {apt?.date} at {apt?.time}
        </p>

        {eligible ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4 text-xs text-emerald-700">
            <span className="font-bold">✓ Refund eligible</span> — You'll receive a full refund of{" "}
            <span className="font-bold">{apt?.fee} ETB</span> within 3–5 business days.
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-xs text-red-700">
            <span className="font-bold">✗ No refund</span> — Cancellations within 24 hours of the appointment are not eligible for a refund.
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Keep It
          </button>
          <button
            onClick={() => onConfirm(apt, eligible)}
            className="flex-1 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStatusColors = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  awaiting_verification: "bg-purple-100 text-purple-700",
};

const statusIcons = {
  upcoming: "schedule",
  completed: "check_circle",
  cancelled: "cancel",
};

function AppointmentDetailModal({ apt, onClose, onJoinCall }) {
  const scheduledDate = new Date(apt.scheduled_at);
  const dateStr = scheduledDate.toLocaleDateString();
  const timeStr = scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Check if within allowed call window (15 min before to 30 min after scheduled time)
  const now = new Date();
  const callWindowStart = new Date(scheduledDate.getTime() - 15 * 60 * 1000); // 15 min before
  const callWindowEnd = new Date(scheduledDate.getTime() + 30 * 60 * 1000); // 30 min after
  const canJoinCall = now >= callWindowStart && now <= callWindowEnd;
  const timeUntilCall = callWindowStart - now;
  const isTooEarly = now < callWindowStart;
  const isTooLate = now > callWindowEnd;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-[#E05C8A] to-[#F4845F] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined text-white text-lg">
              close
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">
                stethoscope
              </span>
            </div>
            <div>
              <h3 className="font-black text-lg">{apt.doctor?.user?.full_name || 'Doctor'}</h3>
              <p className="text-white/80 text-sm">{apt.doctor?.specialty || 'General'}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${apt.status === "upcoming" ? "bg-blue-400/30 text-white" : apt.status === "completed" ? "bg-emerald-400/30 text-white" : "bg-red-400/30 text-white"}`}
            >
              <span className="material-symbols-outlined text-sm">
                {statusIcons[apt.status]}
              </span>
              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
            </span>
            {apt.payment && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${paymentStatusColors[apt.payment.status] || 'bg-gray-100 text-gray-700'}`}
              >
                <span className="material-symbols-outlined text-sm">
                  payments
                </span>
                {apt.payment.status === 'paid' ? 'Paid' : apt.payment.status === 'awaiting_verification' ? 'Pending' : apt.payment.status}
              </span>
            )}
          </div>
        </div>
        <div className="p-6 space-y-3">
          {[
            { icon: "calendar_today", label: "Date", value: dateStr },
            { icon: "schedule", label: "Time", value: timeStr },
            { icon: "payments", label: "Fee", value: `${apt.payment?.amount || apt.doctor?.consultation_fee || 0} ETB` },
            { icon: "account_balance", label: "Payment Method", value: apt.payment?.gateway || 'N/A' },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 bg-[#fff5f7]/40 rounded-xl"
            >
              <span className="material-symbols-outlined text-[#E05C8A] text-lg">
                {icon}
              </span>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
          {apt.notes && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs text-amber-600 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>{" "}
                Notes
              </p>
              <p className="text-sm text-gray-700 mt-1">{apt.notes}</p>
            </div>
          )}
        </div>
        <div className="px-6 pb-6 flex gap-3">
          {apt.status === "upcoming" && apt.payment?.status === 'paid' && (
            <button
              onClick={() => canJoinCall && onJoinCall(apt)}
              disabled={!canJoinCall}
              className={`flex-1 py-2.5 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 ${
                canJoinCall
                  ? 'bg-gradient-to-r from-[#E05C8A] to-[#F4845F] hover:scale-105'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {canJoinCall ? 'videocam' : isTooEarly ? 'schedule' : 'event_busy'}
              </span>
              {canJoinCall
                ? 'Join Video Call'
                : isTooEarly
                ? `Available at ${callWindowStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                : 'Call Window Expired'}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const result = await getMyAppointments();
    if (result.data) {
      setAppointments(result.data);
    }
    setLoading(false);
  };

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  // Handle joining video call - only allowed at scheduled time with verified payment
  const handleJoinCall = async (apt) => {
    try {
      const token = localStorage.getItem("token");

      // Verify payment and appointment eligibility via backend
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(
        `${API_BASE_URL}/api/appointments/${apt._id}/verify-call`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Call verification failed" }));
        alert(errorData.message || "Unable to join call at this time. Please check your appointment time.");
        return;
      }

      const data = await res.json();

      if (data.eligible) {
        // Navigate to video call with appointment data
        navigate(`/consultation/${apt.video_room_id || apt._id}`, {
          state: {
            role: "patient",
            appointmentId: apt._id,
            doctorName: apt.doctor?.user?.full_name || "Doctor",
            patientName: "Patient",
            scheduledAt: apt.scheduled_at,
          },
        });
      } else {
        alert(data.message || "Call is not available at this time.");
      }
    } catch (error) {
      console.error("Join call error:", error);
      alert("Failed to join call. Please try again.");
    }
  };

  if (loading) {
    return (
      <PatientLayout title="Appointments">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#E05C8A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Appointments">
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-[80] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
            ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
            <span className="material-symbols-outlined text-lg">
              {toast.type === "success" ? "check_circle" : "cancel"}
            </span>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#E05C8A] flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl">calendar_today</span>
              My Appointments
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">{appointments.length} total appointments</p>
          </div>
          <button
            onClick={() => navigate("/patient/doctors")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-300 hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Book New
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {["all", "upcoming", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? "bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white shadow-lg shadow-rose-200" : "bg-white text-gray-500 border border-gray-200 hover:border-rose-300 hover:text-[#E05C8A]"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filter === f ? "bg-white/20" : "bg-gray-100"}`}>
                {f === "all" ? appointments.length : appointments.filter((a) => a.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Appointments list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <span className="material-symbols-outlined text-5xl text-gray-200">calendar_today</span>
              <p className="text-gray-400 mt-3">No {filter} appointments</p>
            </div>
          ) : (
            filtered.map((apt) => {
              const scheduledDate = new Date(apt.scheduled_at);
              const dateStr = scheduledDate.toLocaleDateString();
              const timeStr = scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div
                  key={apt._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-rose-200 transition-all duration-300 p-5 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fff5f7] to-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[#E05C8A] text-xl">
                          stethoscope
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-black text-gray-800">
                            {apt.doctor?.user?.full_name || 'Doctor'}
                          </p>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {apt.doctor?.specialty || 'General'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">
                            calendar_today
                          </span>
                          {dateStr} · {timeStr}
                        </p>
                        {apt.payment && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${paymentStatusColors[apt.payment.status] || 'bg-gray-100 text-gray-600'}`}>
                              <span className="material-symbols-outlined text-xs inline-block mr-1 align-text-bottom">
                                payments
                              </span>
                              {apt.payment.status === 'paid' ? 'Paid' : apt.payment.status === 'awaiting_verification' ? 'Pending Verification' : apt.payment.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              {apt.payment.amount} ETB
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-800">
                          {apt.payment?.amount || apt.doctor?.consultation_fee || 0} ETB
                        </p>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[apt.status]}`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelected(apt)}
                        className="p-2 rounded-xl bg-gradient-to-br from-[#fff5f7] to-rose-50 text-[#E05C8A] hover:from-rose-100 transition-all hover:scale-110 border border-rose-100"
                      >
                        <span className="material-symbols-outlined text-lg">
                          open_in_new
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selected && (
        <AppointmentDetailModal
          apt={selected}
          onClose={() => setSelected(null)}
          onJoinCall={handleJoinCall}
        />
      )}
    </PatientLayout>
  );
}
