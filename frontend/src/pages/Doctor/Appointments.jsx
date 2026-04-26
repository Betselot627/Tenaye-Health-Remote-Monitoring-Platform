import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "./components/DoctorLayout";
import { mockDoctorAppointments } from "./data/mockData";

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  in_progress: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
      ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined text-lg">
        {type === "success" ? "check_circle" : "cancel"}
      </span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-red-600">cancel</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Keep Appointment
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppointmentDetailModal({ apt, onClose, onStart }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">
            Appointment Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-[#fdf0f9] rounded-xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] flex items-center justify-center text-white font-black text-xl shadow-lg">
              {apt.patient[0]}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{apt.patient}</p>
              <p className="text-sm text-gray-500">
                {apt.age} yrs · {apt.gender}
              </p>
            </div>
          </div>
          {[
            { label: "Appointment ID", value: apt.id, icon: "tag" },
            { label: "Type", value: apt.type, icon: "medical_services" },
            { label: "Date", value: apt.date, icon: "calendar_today" },
            { label: "Time", value: apt.time, icon: "schedule" },
            { label: "Duration", value: apt.duration, icon: "timer" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2 border-b border-gray-50"
            >
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-base text-[#7B2D8B]">
                  {row.icon}
                </span>
                {row.label}
              </div>
              <span className="font-semibold text-gray-800 text-sm">
                {row.value}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-500 text-sm">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[apt.status]}`}
            >
              {apt.status.replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          {apt.status === "upcoming" && (
            <button
              onClick={() => onStart(apt)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
            >
              Start Consultation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setAppointments(mockDoctorAppointments);
      setLoading(false);
    }, 400);
  }, []);

  if (loading)
    return (
      <DoctorLayout title="Appointments">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DoctorLayout>
    );

  const filtered = appointments.filter(
    (a) => activeTab === "all" || a.status === activeTab,
  );

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCancel = (apt) => setConfirmModal({ apt });

  const confirmCancel = () => {
    const apt = confirmModal.apt;
    setAppointments((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: "cancelled" } : a)),
    );
    setConfirmModal(null);
    showToast(`Appointment ${apt.id} has been cancelled.`, "error");
  };

  const handleStart = (apt) => {
    setDetailModal(null);
    navigate(`/consultation/${apt.id}`);
  };

  return (
    <DoctorLayout title="Appointments">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {confirmModal && (
        <ConfirmModal
          title="Cancel Appointment"
          message={`Cancel appointment ${confirmModal.apt.id} with ${confirmModal.apt.patient}? This cannot be undone.`}
          confirmLabel="Cancel Appointment"
          onConfirm={confirmCancel}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      {detailModal && (
        <AppointmentDetailModal
          apt={detailModal}
          onClose={() => setDetailModal(null)}
          onStart={handleStart}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">
            My Appointments
          </h2>
          <p className="text-gray-400 mt-1">
            Manage your scheduled consultations
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Today's Total",
            value: appointments.filter((a) => a.date === "2025-04-26").length,
            color: "text-[#7B2D8B]",
            bg: "bg-white",
          },
          {
            label: "Upcoming",
            value: appointments.filter((a) => a.status === "upcoming").length,
            color: "text-blue-600",
            bg: "bg-white",
          },
          {
            label: "Completed",
            value: appointments.filter((a) => a.status === "completed").length,
            color: "text-emerald-600",
            bg: "bg-white",
          },
          {
            label: "Cancelled",
            value: appointments.filter((a) => a.status === "cancelled").length,
            color: "text-red-500",
            bg: "bg-white",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} p-6 rounded-2xl shadow-sm`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex gap-2 flex-wrap">
          {["all", "upcoming", "in_progress", "completed", "cancelled"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-[#7B2D8B] text-white"
                    : "text-gray-400 hover:bg-[#fdf0f9]"
                }`}
              >
                {tab === "all" ? "All" : tab.replace("_", " ")}
              </button>
            ),
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fdf0f9]/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Patient</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Date & Time</th>
                <th className="px-6 py-5">Duration</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filtered.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-purple-50/20 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    {apt.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{apt.patient}</p>
                    <p className="text-xs text-gray-400">
                      {apt.age} yrs · {apt.gender}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{apt.type}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-700">{apt.date}</p>
                    <p className="text-xs text-gray-400">{apt.time}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{apt.duration}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[apt.status]}`}
                    >
                      {apt.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDetailModal(apt)}
                        className="p-2 text-[#7B2D8B] hover:bg-purple-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <span className="material-symbols-outlined text-xl">
                          visibility
                        </span>
                      </button>
                      {apt.status === "upcoming" && (
                        <>
                          <button
                            onClick={() => navigate(`/consultation/${apt.id}`)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Start consultation"
                          >
                            <span className="material-symbols-outlined text-xl">
                              video_call
                            </span>
                          </button>
                          <button
                            onClick={() => handleCancel(apt)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel appointment"
                          >
                            <span className="material-symbols-outlined text-xl">
                              cancel
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-[#fdf0f9]/30 border-t border-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400 font-medium">
            Showing {filtered.length} appointments
          </p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#7B2D8B] text-white font-bold text-xs">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
