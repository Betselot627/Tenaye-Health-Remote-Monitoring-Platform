import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "./components/DoctorLayout";
import { getDoctorAppointments } from "../../services/patientService";

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  in_progress: "bg-teal-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStatusColors = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  awaiting_verification: "bg-purple-100 text-purple-700",
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
  const scheduledDate = new Date(apt.scheduled_at);
  const dateStr = scheduledDate.toLocaleDateString();
  const timeStr = scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
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
          <div className="flex items-center gap-4 p-4 bg-[#f0fafa] rounded-xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D7377] to-[#14A085] flex items-center justify-center text-white font-black text-xl shadow-lg">
              {apt.patient?.full_name?.[0] || 'P'}
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{apt.patient?.full_name || 'Patient'}</p>
              <p className="text-sm text-gray-500">{apt.patient?.email || ''}</p>
            </div>
          </div>
          {[
            { label: "Appointment ID", value: apt._id?.slice(-8) || 'N/A', icon: "tag" },
            { label: "Date", value: dateStr, icon: "calendar_today" },
            { label: "Time", value: timeStr, icon: "schedule" },
            { label: "Consultation Fee", value: `${apt.payment?.amount || 0} ETB`, icon: "payments" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2 border-b border-gray-50"
            >
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="material-symbols-outlined text-base text-[#0D7377]">
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
            <span className="text-gray-500 text-sm">Appointment Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[apt.status]}`}
            >
              {apt.status.replace("_", " ")}
            </span>
          </div>
          {apt.payment && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 text-sm">Payment Status</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${paymentStatusColors[apt.payment.status] || 'bg-gray-100 text-gray-700'}`}
              >
                {apt.payment.status === 'paid' ? 'Paid' : apt.payment.status === 'awaiting_verification' ? 'Pending' : apt.payment.status}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          {apt.status === "upcoming" && apt.payment?.status === 'paid' && (
            <button
              onClick={() => onStart(apt)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0D7377] to-[#14A085] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
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
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const result = await getDoctorAppointments();
    if (result.data) {
      setAppointments(result.data);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <DoctorLayout title="Appointments">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#0D7377] border-t-transparent rounded-full animate-spin"></div>
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
      prev.map((a) => (a._id === apt._id ? { ...a, status: "cancelled" } : a)),
    );
    setConfirmModal(null);
    showToast(`Appointment ${apt._id?.slice(-8) || 'N/A'} has been cancelled.`, "error");
  };

  const handleStart = (apt) => {
    setDetailModal(null);
    navigate(`/consultation/${apt._id}`);
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
          message={`Cancel appointment ${confirmModal.apt._id?.slice(-8) || 'N/A'} with ${confirmModal.apt.patient?.full_name || 'Patient'}? This cannot be undone.`}
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
          <h2 className="text-3xl font-black text-[#0D7377]">
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
            color: "text-[#0D7377]",
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
                    ? "bg-[#0D7377] text-white"
                    : "text-gray-400 hover:bg-[#f0fafa]"
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
              <tr className="bg-[#f0fafa]/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
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
              {filtered.map((apt) => {
            const scheduledDate = new Date(apt.scheduled_at);
            const dateStr = scheduledDate.toLocaleDateString();
            const timeStr = scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
                <tr
                  key={apt._id}
                  className="hover:bg-teal-50/20 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    {apt._id?.slice(-8) || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{apt.patient?.full_name || 'Patient'}</p>
                    <p className="text-xs text-gray-400">{apt.patient?.email || ''}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">Video Call</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-700">{dateStr}</p>
                    <p className="text-xs text-gray-400">{timeStr}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{apt.payment?.amount || 0} ETB</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${statusColors[apt.status]}`}
                      >
                        {apt.status.replace("_", " ")}
                      </span>
                      {apt.payment && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${paymentStatusColors[apt.payment.status] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {apt.payment.status === 'paid' ? 'Paid' : apt.payment.status === 'awaiting_verification' ? 'Pending' : apt.payment.status}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDetailModal(apt)}
                        className="p-2 text-[#0D7377] hover:bg-teal-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <span className="material-symbols-outlined text-xl">
                          visibility
                        </span>
                      </button>
                      {apt.status === "upcoming" && (
                        <>
                          <button
                            onClick={() => navigate(`/consultation/${apt._id}`)}
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
              )})}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-[#f0fafa]/30 border-t border-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400 font-medium">
            Showing {filtered.length} appointments
          </p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0D7377] text-white font-bold text-xs">
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
