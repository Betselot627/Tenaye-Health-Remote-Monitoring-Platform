import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "./components/PatientLayout";
import { mockPatientAppointments } from "./data/mockData";

// ─── Cancel confirmation modal ─────────────────────────────────────────────────
function CancelModal({ apt, onConfirm, onClose }) {
  const hoursUntil = apt
    ? Math.floor((new Date(`${apt.date}T${apt.time.replace(" AM", "").replace(" PM", "")}`) - new Date()) / 36e5)
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

const statusIcons = {
  upcoming: "schedule",
  completed: "check_circle",
  cancelled: "cancel",
};

function AppointmentDetailModal({ apt, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] p-6 text-white relative">
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
              <h3 className="font-black text-lg">{apt.doctor}</h3>
              <p className="text-white/80 text-sm">{apt.specialty}</p>
            </div>
          </div>
          <span
            className={`mt-3 inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${apt.status === "upcoming" ? "bg-blue-400/30 text-white" : apt.status === "completed" ? "bg-emerald-400/30 text-white" : "bg-red-400/30 text-white"}`}
          >
            <span className="material-symbols-outlined text-sm">
              {statusIcons[apt.status]}
            </span>
            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
          </span>
        </div>
        <div className="p-6 space-y-3">
          {[
            { icon: "calendar_today", label: "Date", value: apt.date },
            {
              icon: "schedule",
              label: "Time",
              value: `${apt.time} (${apt.duration})`,
            },
            { icon: "category", label: "Type", value: apt.type },
            { icon: "location_on", label: "Location", value: apt.location },
            { icon: "payments", label: "Fee", value: `${apt.fee} ETB` },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 bg-[#fdf0f9]/40 rounded-xl"
            >
              <span className="material-symbols-outlined text-[#7B2D8B] text-lg">
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
          {apt.status === "upcoming" && (
            <button className="flex-1 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">
                videocam
              </span>
              Join Video Call
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
  const [appointments, setAppointments] = useState(mockPatientAppointments);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCancelConfirm = (apt, refundEligible) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: "cancelled" } : a))
    );
    setCancelTarget(null);
    showToast(
      refundEligible
        ? `Appointment cancelled. ${apt.fee} ETB refund initiated.`
        : "Appointment cancelled. No refund (within 24 hours).",
      refundEligible ? "success" : "error"
    );
  };

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
            <h2 className="text-2xl font-black text-[#7B2D8B] flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl">calendar_today</span>
              My Appointments
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">{appointments.length} total appointments</p>
          </div>
          <button
            onClick={() => navigate("/patient/doctors")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-300 hover:scale-105 transition-all"
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
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? "bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white shadow-lg shadow-purple-200" : "bg-white text-gray-500 border border-gray-200 hover:border-purple-300 hover:text-[#7B2D8B]"}`}
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
            filtered.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-5 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fdf0f9] to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                      <span className="material-symbols-outlined text-[#7B2D8B] text-xl">stethoscope</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-black text-gray-800">{apt.doctor}</p>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{apt.specialty}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        {apt.date} · {apt.time} · {apt.type}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {apt.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right mr-1">
                      <p className="text-sm font-black text-gray-800">{apt.fee} ETB</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[apt.status]}`}>
                        {apt.status}
                      </span>
                    </div>
                    {/* Join video call */}
                    {apt.status === "upcoming" && (
                      <button
                        onClick={() =>
                          navigate(`/consultation/${apt.id}`, {
                            state: {
                              role: "patient",
                              appointmentId: apt.id,
                              doctorName: apt.doctor,
                              patientName: "Bereket Tadesse",
                            },
                          })
                        }
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all hover:scale-110 border border-emerald-100"
                        title="Join video call"
                      >
                        <span className="material-symbols-outlined text-lg">videocam</span>
                      </button>
                    )}
                    {/* Cancel */}
                    {apt.status === "upcoming" && (
                      <button
                        onClick={() => setCancelTarget(apt)}
                        className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all hover:scale-110 border border-red-100"
                        title="Cancel appointment"
                      >
                        <span className="material-symbols-outlined text-lg">event_busy</span>
                      </button>
                    )}
                    {/* View details */}
                    <button
                      onClick={() => setSelected(apt)}
                      className="p-2 rounded-xl bg-gradient-to-br from-[#fdf0f9] to-purple-50 text-[#7B2D8B] hover:from-purple-100 transition-all hover:scale-110 border border-purple-100"
                      title="View details"
                    >
                      <span className="material-symbols-outlined text-lg">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selected && (
        <AppointmentDetailModal apt={selected} onClose={() => setSelected(null)} />
      )}
      {cancelTarget && (
        <CancelModal
          apt={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </PatientLayout>
  );
}
