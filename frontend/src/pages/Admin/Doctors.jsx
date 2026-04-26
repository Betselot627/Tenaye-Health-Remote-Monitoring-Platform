import { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { mockDoctors, mockStats } from "./data/mockData";

const statusColors = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700 animate-pulse",
  suspended: "bg-red-100 text-red-700",
};

export default function AdminDoctors() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = mockDoctors.filter((d) => activeTab === "all" || d.status === activeTab);

  return (
    <AdminLayout title="Doctor Management">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Doctor Management</h2>
          <p className="text-gray-400 mt-1">Verification pipeline and practitioner directory</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-full border border-gray-200 text-[#7B2D8B] font-semibold text-sm hover:bg-[#fdf0f9] transition-colors">
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#7B2D8B] text-white rounded-full font-bold shadow-lg shadow-purple-200 hover:bg-purple-800 transition-colors active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span>
            Add New Doctor
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-[#7B2D8B] mb-3 block">medical_services</span>
          <p className="text-4xl font-black text-gray-800">{mockStats.activeDoctors.toLocaleString()}</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Total Doctors</p>
        </div>
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#600f72] p-6 rounded-2xl text-white shadow-lg">
          <span className="material-symbols-outlined mb-3 block opacity-70">pending_actions</span>
          <p className="text-4xl font-black">{mockStats.pendingDoctors}</p>
          <p className="text-xs font-semibold opacity-70 uppercase tracking-wider mt-1">Pending Approval</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-emerald-600 mb-3 block">verified</span>
          <p className="text-4xl font-black text-emerald-600">1,150</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Active Staff</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-amber-500 mb-3 block">star</span>
          <p className="text-4xl font-black text-gray-800">4.92</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Avg Rating</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="p-4 border-b border-gray-50 flex gap-2">
          {["all", "pending", "approved", "suspended"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                activeTab === tab ? "bg-[#7B2D8B] text-white" : "text-gray-400 hover:bg-[#fdf0f9]"
              }`}
            >
              {tab === "all" ? "All Doctors" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fdf0f9]/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-8 py-5">Doctor Name</th>
                <th className="px-6 py-5">Specialty</th>
                <th className="px-6 py-5">Experience</th>
                <th className="px-6 py-5">Rating</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
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
                  <tr key={doc.id} className="hover:bg-purple-50/20 transition-colors group">
                    <td className="px-8 py-5">
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
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {doc.status === "pending" && (
                          <>
                            <button className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:shadow-lg transition-all active:scale-90" title="Approve">
                              <span className="material-symbols-outlined text-lg">check</span>
                            </button>
                            <button className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center hover:shadow-lg transition-all active:scale-90" title="Reject">
                              <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                          </>
                        )}
                        {doc.status === "approved" && (
                          <button className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center hover:shadow-lg transition-all active:scale-90" title="Suspend">
                            <span className="material-symbols-outlined text-lg">pause_circle</span>
                          </button>
                        )}
                        {doc.status === "suspended" && (
                          <button className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center hover:shadow-lg transition-all active:scale-90" title="Reinstate">
                            <span className="material-symbols-outlined text-lg">play_circle</span>
                          </button>
                        )}
                        <button className="w-9 h-9 rounded-xl bg-[#fdf0f9] text-[#7B2D8B] flex items-center justify-center hover:bg-[#7B2D8B] hover:text-white transition-all active:scale-90" title="View">
                          <span className="material-symbols-outlined text-lg">visibility</span>
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
        <div className="px-8 py-4 bg-[#fdf0f9]/30 border-t border-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400 font-semibold">Showing {filtered.length} of {mockDoctors.length} doctors</p>
          <div className="flex gap-1">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#7B2D8B] text-white font-bold text-sm">1</button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white text-gray-400 font-bold text-sm">2</button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 rounded-full bg-[#7B2D8B] text-white flex items-center justify-center shadow-2xl shadow-purple-400/40 hover:scale-110 active:scale-95 transition-all group">
          <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add</span>
        </button>
      </div>
    </AdminLayout>
  );
}
