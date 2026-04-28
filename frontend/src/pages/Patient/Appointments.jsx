import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "./components/PatientLayout";
import { mockPatientAppointments } from "./data/mockData";

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
          {apt.status === "upcoming" && (
            <button className="flex-1 py-2.5 bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
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
  const [appointments] = useState(mockPatientAppointments);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <PatientLayout title="Appointments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#E05C8A] flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl">
                calendar_today
              </span>
              My Appointments
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {appointments.length} total appointments
            </p>
          </div>
          <button
            onClick={() => navigate("/patient/doctors")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-300 hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined text-sm">
              add_circle
            </span>
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
              <span
                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filter === f ? "bg-white/20" : "bg-gray-100"}`}
              >
                {f === "all"
                  ? appointments.length
                  : appointments.filter((a) => a.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Appointments list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <span className="material-symbols-outlined text-5xl text-gray-200">
                calendar_today
              </span>
              <p className="text-gray-400 mt-3">No {filter} appointments</p>
            </div>
          ) : (
            filtered.map((apt) => (
              <div
                key={apt.id}
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
                          {apt.doctor}
                        </p>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {apt.specialty}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                          calendar_today
                        </span>
                        {apt.date} · {apt.time} · {apt.type}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-xs">
                          location_on
                        </span>
                        {apt.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-800">
                        {apt.fee} ETB
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
            ))
          )}
        </div>
      </div>

      {selected && (
        <AppointmentDetailModal
          apt={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </PatientLayout>
  );
}
