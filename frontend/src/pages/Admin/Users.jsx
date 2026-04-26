import { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import { getPatients, blockUser, unblockUser } from "../../services/adminService";

const statusColors = {
  active: "bg-emerald-100 text-emerald-700",
  blocked: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
};

function Toast({ message, type, onClose }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
      ${type === "success" ? "bg-emerald-600" : type === "error" ? "bg-red-600" : "bg-[#7B2D8B]"}`}>
      <span className="material-symbols-outlined text-lg">
        {type === "success" ? "check_circle" : type === "error" ? "block" : "info"}
      </span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

function ConfirmModal({ title, message, confirmLabel, confirmColor = "bg-red-600", onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-red-600">warning</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
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

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await getPatients();
      if (data) setUsers(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <AdminLayout title="User Management">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBlockToggle = async (user) => {
    if (user.status === "blocked") {
      await unblockUser(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "active" } : u));
      showToast(`${user.name} has been unblocked.`, "success");
    } else {
      setConfirmModal({ user });
    }
  };

  const confirmBlock = async () => {
    const user = confirmModal.user;
    await blockUser(user.id);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: "blocked" } : u));
    setConfirmModal(null);
    showToast(`${user.name} has been blocked.`, "error");
  };

  return (
    <AdminLayout title="User Management">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Block Confirmation */}
      {confirmModal && (
        <ConfirmModal
          title="Block Patient Account"
          message={`Are you sure you want to block ${confirmModal.user.name}? They will not be able to log in or book appointments.`}
          confirmLabel="Block Account"
          confirmColor="bg-red-600"
          onConfirm={confirmBlock}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Patient Directory</h2>
          <p className="text-gray-400 mt-1">Manage and monitor patient accounts</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-full font-bold hover:bg-purple-100 transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#600f72] p-6 rounded-2xl text-white">
          <span className="material-symbols-outlined mb-3 block">group</span>
          <p className="text-3xl font-black">{users.length.toLocaleString()}</p>
          <p className="text-xs font-semibold opacity-70 uppercase tracking-wider mt-1">Total Patients</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-red-500 mb-3 block">block</span>
          <p className="text-3xl font-black text-gray-800">{users.filter(u => u.status === "blocked").length}</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Blocked Accounts</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-amber-500 mb-3 block">pending_actions</span>
          <p className="text-3xl font-black text-gray-800">{users.filter(u => u.status === "pending").length}</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Pending Verification</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">Search</label>
          <input
            className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
            placeholder="Filter by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-48">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 block">Status</label>
          <select
            className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fdf0f9] text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-6 py-5">Patient Name</th>
                <th className="px-6 py-5">Age</th>
                <th className="px-6 py-5">Gender</th>
                <th className="px-6 py-5">Last Active</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#7B2D8B] flex items-center justify-center text-white font-bold text-sm">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{user.age}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[#fdf0f9] text-[#7B2D8B] rounded-full text-xs font-semibold">{user.gender}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-[#7B2D8B] hover:bg-purple-50 rounded-lg transition-colors" title="View Profile">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      <button
                        onClick={() => handleBlockToggle(user)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === "blocked"
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-red-500 hover:bg-red-50"
                        }`}
                        title={user.status === "blocked" ? "Unblock" : "Block"}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {user.status === "blocked" ? "check_circle" : "block"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 bg-[#fdf0f9]/30 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">Showing {filtered.length} of {users.length} entries</p>
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
