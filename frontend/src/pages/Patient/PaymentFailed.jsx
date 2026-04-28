import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const info = state || {
    doctor: "Dr. Unknown",
    specialty: "General",
    date: "—",
    time: "—",
    amount: 0,
    method: "—",
    reason: "Payment was declined or cancelled.",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Top banner */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white text-4xl">cancel</span>
              </div>
              <h1 className="text-2xl font-black">Payment Failed</h1>
              <p className="text-red-100 text-sm mt-1">Your appointment was not confirmed</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">

            {/* Reason */}
            <div className="bg-red-50 rounded-2xl p-4 border border-red-100 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
              <div>
                <p className="text-sm font-bold text-red-700">What went wrong</p>
                <p className="text-xs text-red-600 mt-0.5">{info.reason}</p>
              </div>
            </div>

            {/* Attempted booking */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Attempted Booking</p>
              {[
                { icon: "person", label: "Doctor", value: info.doctor },
                { icon: "calendar_today", label: "Date", value: info.date },
                { icon: "schedule", label: "Time", value: info.time },
                { icon: "payments", label: "Amount", value: `${info.amount} ETB` },
                { icon: "phone_android", label: "Method", value: info.method },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span className="material-symbols-outlined text-sm text-gray-400">{icon}</span>
                    {label}
                  </div>
                  <span className="text-xs font-bold text-gray-700">{value}</span>
                </div>
              ))}
            </div>

            {/* What to do */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-xs font-black text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lightbulb</span>
                What you can do
              </p>
              <ul className="space-y-1.5 text-xs text-amber-700">
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-xs mt-0.5">arrow_right</span>
                  Check your card balance or mobile money balance
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-xs mt-0.5">arrow_right</span>
                  Try a different payment method
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-xs mt-0.5">arrow_right</span>
                  Contact your bank if the issue persists
                </li>
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={() => navigate("/patient/doctors")}
              className="flex-1 py-3 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Try Again
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
