import { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { mockUsers, mockStats } from "./data/mockData";

const statusColors = {
  active: "bg-emerald-100 text-emerald-700",
  blocked: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout title="User Management">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <nav className="flex text-xs font-medium text-gray-400 mb-2 gap-2 uppercase tracking-widest">
            <span>Admin</span><span>/</span><span className="text-[#7B2D8B]">User Management</span>
          </nav>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Patient Directory</h2>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#7B2D8B] text-white rounded-full font-bold shadow-lg shadow-purple-200 hover:bg-purple-800 transition-colors active:scale-95">
          <span className="material-symbols-outlined text-sm">person_add</span>
          Register New Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#600f72] p-6 rounded-2xl text-white">
          <span className="material-symbols-outlined mb-3 block">group</span>
          <p className="text-3xl font-black">{mockStats.totalPatients.toLocaleString()}</p>
          <p className="text-xs font-semibold opacity-70 uppercase tracking-wider mt-1">Total Active Patients</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-red-500 mb-3 block">block</span>
          <p className="text-3xl font-black text-gray-800">{mockStats.blockedUsers}</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Blocked Accounts</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-amber-500 mb-3 block">pending_actions</span>
          <p className="text-3xl font-black text-gray-800">18</p>
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
                      <button className="p-2 text-[#7B2D8B] hover:bg-purple-50 rounded-lg transition-colors" title="View">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      {user.status === "blocked" ? (
                        <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Unblock">
                          <span className="material-symbols-outlined text-xl">check_circle</span>
                        </button>
                      ) : (
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Block">
                          <span className="material-symbols-outlined text-xl">block</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 bg-[#fdf0f9]/30 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">Showing {filtered.length} of {mockUsers.length} entries</p>
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
