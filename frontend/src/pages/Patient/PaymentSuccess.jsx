import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8);

  // Auto-redirect to appointments after 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/patient/appointments");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  // Fallback if navigated directly without state
  const info = state || {
    doctor: "Dr. Unknown",
    specialty: "General",
    date: "—",
    time: "—",
    amount: 0,
    method: "—",
    receipt: "RCP-000000",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf0f9] via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Success animation card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Top banner */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
              </div>
              <h1 className="text-2xl font-black">Payment Successful!</h1>
              <p className="text-emerald-100 text-sm mt-1">Your appointment is confirmed</p>
            </div>
          </div>

          {/* Receipt details */}
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Appointment Details</p>
              {[
                { icon: "person", label: "Doctor", value: info.doctor },
                { icon: "stethoscope", label: "Specialty", value: info.specialty },
                { icon: "calendar_today", label: "Date", value: info.date },
                { icon: "schedule", label: "Time", value: info.time },
                { icon: "phone_android", label: "Payment Method", value: info.method },
                { icon: "receipt_long", label: "Receipt No.", value: info.receipt },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span className="material-symbols-outlined text-sm text-[#7B2D8B]">{icon}</span>
                    {label}
                  </div>
                  <span className="text-xs font-bold text-gray-800 text-right max-w-[55%] truncate">{value}</span>
                </div>
              ))}
            </div>

            {/* Amount paid */}
            <div className="bg-gradient-to-r from-[#fdf0f9] to-purple-50 rounded-2xl p-4 flex items-center justify-between border border-purple-100">
              <div>
                <p className="text-xs text-gray-400 font-semibold">Amount Paid</p>
                <p className="text-3xl font-black text-[#7B2D8B]">{info.amount} ETB</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#7B2D8B] flex items-center justify-center shadow-lg shadow-purple-200">
                <span className="material-symbols-outlined text-white text-2xl">payments</span>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-xs font-black text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                What happens next
              </p>
              <ul className="space-y-1.5 text-xs text-blue-700">
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-xs mt-0.5 text-blue-500">check</span>
                  You'll receive a confirmation notification
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-xs mt-0.5 text-blue-500">check</span>
                  A reminder will be sent 1 hour before your appointment
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-xs mt-0.5 text-blue-500">check</span>
                  Join the video call from My Appointments at the scheduled time
                </li>
              </ul>
            </div>

            {/* Auto-redirect notice */}
            <p className="text-center text-xs text-gray-400">
              Redirecting to your appointments in{" "}
              <span className="font-black text-[#7B2D8B]">{countdown}s</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={() => navigate("/patient/appointments")}
              className="flex-1 py-3 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              View My Appointments
            </button>
            <button
              onClick={() => navigate("/patient")}
              className="px-4 py-3 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
