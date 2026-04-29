import { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import { getDoctors, approveDoctor, rejectDoctor, suspendDoctor, reinstateDoctor } from "../../services/adminService";
import { exportDoctors } from "../../utils/exportUtils";

const statusColors = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700 animate-pulse",
  suspended: "bg-red-100 text-red-700",
};

// Extended mock data with full application details
const doctorDetails = {
  "1": { license: "ETH-MED-2013-4821", hospital: "Black Lion Hospital, Addis Ababa", bio: "Experienced cardiologist specializing in heart failure and interventional cardiology. Trained at Addis Ababa University.", phone: "+251 91 234 5678", email: "alem.bekele@email.com" },
  "2": { license: "ETH-MED-2016-7734", hospital: "St. Paul's Hospital, Addis Ababa", bio: "Neurologist with expertise in stroke management and epilepsy treatment.", phone: "+251 92 345 6789", email: "tigist.worku@email.com" },
  "3": { license: "USA-MED-2009-3312", hospital: "Tikur Anbessa Specialized Hospital", bio: "Endocrinologist focused on diabetes management and thyroid disorders.", phone: "+251 93 456 7890", email: "michael.chen@email.com" },
  "4": { license: "ETH-MED-2019-9901", hospital: "Yekatit 12 Hospital, Addis Ababa", bio: "General practitioner with a focus on preventive care and chronic disease management.", phone: "+251 94 567 8901", email: "sara.jenkins@email.com" },
  "5": { license: "ETH-MED-2014-5567", hospital: "Amanuel Mental Specialized Hospital", bio: "Psychiatrist specializing in mood disorders, anxiety, and addiction medicine.", phone: "+251 95 678 9012", email: "robert.kovac@email.com" },
};

// Simple Toast component
function Toast({ message, type, onClose }) {
  return (
    <div className={`fixed bottom-6 right-6 z-100 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold animate-bounce-in
      ${type === "success" ? "bg-emerald-600" : type === "error" ? "bg-red-600" : "bg-[#7B2D8B]"}`}>
      <span className="material-symbols-outlined text-lg">
        {type === "success" ? "check_circle" : type === "error" ? "error" : "info"}
      </span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

// Confirmation Modal
function ConfirmModal({ title, message, confirmLabel, confirmColor = "bg-red-600", onConfirm, onCancel, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        {children}
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-3 ${confirmColor} text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Doctor Detail Modal
function DoctorDetailModal({ doc, details, onClose, onApprove, onReject }) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const detail = details || {};

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-[#7B2D8B] to-[#600f72] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">Doctor Application</h3>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
              {doc.name.split(" ")[1]?.[0] || "D"}
            </div>
            <div>
              <p className="text-white font-bold text-xl">{doc.name}</p>
              <p className="text-white/70 text-sm">{doc.specialty} · {doc.experience}</p>
              <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${statusColors[doc.status]}`}>
                {doc.status}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#fdf0f9] p-4 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">License No.</p>
              <p className="text-sm font-bold text-gray-800">{detail.license || doc.license_number || "N/A"}</p>
            </div>
            <div className="bg-[#fdf0f9] p-4 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Consultation Fee</p>
              <p className="text-sm font-bold text-gray-800">{doc.fee} ETB</p>
            </div>
            <div className="bg-[#fdf0f9] p-4 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Phone</p>
              <p className="text-sm font-bold text-gray-800">{detail.phone || doc.phone || "N/A"}</p>
            </div>
            <div className="bg-[#fdf0f9] p-4 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email</p>
              <p className="text-sm font-bold text-gray-800 truncate">{detail.email || doc.email || "N/A"}</p>
            </div>
          </div>

          <div className="bg-[#fdf0f9] p-4 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Hospital / Clinic</p>
            <p className="text-sm font-bold text-gray-800">{detail.hospital || doc.hospital || "N/A"}</p>
          </div>

          <div className="bg-[#fdf0f9] p-4 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Bio</p>
            <p className="text-sm text-gray-600 leading-relaxed">{detail.bio || doc.bio || "No bio provided."}</p>
          </div>

          {/* Reject reason form */}
          {showRejectForm && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <label className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2 block">
                Rejection Reason (sent to doctor by email)
              </label>
              <textarea
                className="w-full bg-white border border-red-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none h-24"
                placeholder="e.g. License number could not be verified. Please resubmit with a valid medical license..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}

          {/* Actions — only for pending */}
          {doc.status === "pending" && (
            <div className="flex gap-3 pt-2">
              {!showRejectForm ? (
                <>
                  <button
                    onClick={() => onApprove(doc)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Approve Doctor
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">cancel</span>
                    Reject
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => onReject(doc, rejectReason)}
                    disabled={!rejectReason.trim()}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Rejection
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDoctors() {
  const [activeTab, setActiveTab] = useState("all");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await getDoctors();
      if (data) setDoctors(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <AdminLayout title="Doctor Management">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  const filtered = doctors.filter((d) => activeTab === "all" || d.status === activeTab);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = (doc) => {
    approveDoctor(doc.id).then(({ error }) => {
      if (error) return showToast(error, "error");
      setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, status: "approved" } : d));
      setSelectedDoc(null);
      showToast(`${doc.name} has been approved.`, "success");
    });
  };

  const handleReject = (doc, _reason) => {
    rejectDoctor(doc.id, _reason).then(({ error }) => {
      if (error) return showToast(error, "error");
      setDoctors(prev => prev.filter(d => d.id !== doc.id));
      setSelectedDoc(null);
      showToast(`${doc.name}'s application was rejected.`, "error");
    });
  };

  const handleSuspend = (doc) => {
    suspendDoctor(doc.id).then(({ error }) => {
      if (error) return showToast(error, "error");
      setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, status: "suspended" } : d));
      setConfirmModal(null);
      showToast(`${doc.name} has been suspended.`, "error");
    });
  };

  const handleReinstate = (doc) => {
    reinstateDoctor(doc.id).then(({ error }) => {
      if (error) return showToast(error, "error");
      setDoctors(prev => prev.map(d => d.id === doc.id ? { ...d, status: "approved" } : d));
      setConfirmModal(null);
      showToast(`${doc.name} has been reinstated.`, "success");
    });
  };

  return (
    <AdminLayout title="Doctor Management">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Doctor Detail Modal */}
      {selectedDoc && (
        <DoctorDetailModal
          doc={selectedDoc}
          details={doctorDetails[selectedDoc.id]}
          onClose={() => setSelectedDoc(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Suspend Confirmation */}
      {confirmModal?.type === "suspend" && (
        <ConfirmModal
          title="Suspend Doctor"
          message={`Are you sure you want to suspend ${confirmModal.doc.name}? They will not be able to accept new appointments.`}
          confirmLabel="Suspend"
          confirmColor="bg-amber-500"
          onConfirm={() => handleSuspend(confirmModal.doc)}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Reinstate Confirmation */}
      {confirmModal?.type === "reinstate" && (
        <ConfirmModal
          title="Reinstate Doctor"
          message={`Reinstate ${confirmModal.doc.name}? They will be able to accept appointments again.`}
          confirmLabel="Reinstate"
          confirmColor="bg-emerald-600"
          onConfirm={() => handleReinstate(confirmModal.doc)}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Doctor Management</h2>
          <p className="text-gray-400 mt-1">Verification pipeline and practitioner directory</p>
        </div>
        <button 
          onClick={() => exportDoctors(doctors)}
          className="px-6 py-3 rounded-full border border-gray-200 text-[#7B2D8B] font-semibold text-sm hover:bg-[#fdf0f9] transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-[#7B2D8B] mb-3 block">medical_services</span>
          <p className="text-3xl font-black text-gray-800">{doctors.length}</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Total Doctors</p>
        </div>
        <div className="bg-linear-to-br from-[#7B2D8B] to-[#600f72] p-6 rounded-2xl text-white shadow-lg">
          <span className="material-symbols-outlined mb-3 block opacity-70">pending_actions</span>
          <p className="text-3xl font-black">{doctors.filter(d => d.status === "pending").length}</p>
          <p className="text-xs font-semibold opacity-70 uppercase tracking-wider mt-1">Pending Approval</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-emerald-600 mb-3 block">verified</span>
          <p className="text-3xl font-black text-emerald-600">{doctors.filter(d => d.status === "approved").length}</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Active Staff</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-amber-500 mb-3 block">star</span>
          <p className="text-3xl font-black text-gray-800">4.92</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Avg Rating</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="p-4 border-b border-gray-50 flex gap-2 flex-wrap">
          {["all", "pending", "approved", "suspended"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                activeTab === tab ? "bg-[#7B2D8B] text-white" : "text-gray-400 hover:bg-[#fdf0f9]"
              }`}
            >
              {tab === "all" ? "All Doctors" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "pending" && doctors.filter(d => d.status === "pending").length > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {doctors.filter(d => d.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fdf0f9]/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-6 py-5">Doctor Name</th>
                <th className="px-6 py-5">Specialty</th>
                <th className="px-6 py-5">Experience</th>
                <th className="px-6 py-5">Rating</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">check_circle</span>
                    <p className="text-gray-400 font-medium">No doctors in this category</p>
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#7B2D8B] flex items-center justify-center text-white font-bold">
                          {doc.name.split(" ")[1]?.[0] || "D"}
                        </div>
                        <div>
                          <p className="font-bold text-[#7B2D8B]">{doc.name}</p>
                          <p className="text-xs text-gray-400">Fee: {doc.fee} ETB</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-gray-500">{doc.specialty}</td>
                    <td className="px-6 py-5 text-gray-400">{doc.experience}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="material-symbols-outlined text-sm">star</span>
                        <span className="font-bold text-gray-800">{doc.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[doc.status]}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {doc.status === "approved" && (
                          <button
                            onClick={() => setConfirmModal({ type: "suspend", doc })}
                            className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center hover:shadow-lg transition-all active:scale-90"
                            title="Suspend"
                          >
                            <span className="material-symbols-outlined text-lg">pause_circle</span>
                          </button>
                        )}
                        {doc.status === "suspended" && (
                          <button
                            onClick={() => setConfirmModal({ type: "reinstate", doc })}
                            className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center hover:shadow-lg transition-all active:scale-90"
                            title="Reinstate"
                          >
                            <span className="material-symbols-outlined text-lg">play_circle</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="w-9 h-9 rounded-xl bg-[#fdf0f9] text-[#7B2D8B] flex items-center justify-center hover:bg-[#7B2D8B] hover:text-white transition-all active:scale-90"
                          title={doc.status === "pending" ? "Review Application" : "View Profile"}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {doc.status === "pending" ? "assignment" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-[#fdf0f9]/30 border-t border-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400 font-semibold">Showing {filtered.length} of {doctors.length} doctors</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#7B2D8B] text-white font-bold text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 font-bold text-xs">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
