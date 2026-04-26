import { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { mockAppointments, mockStats } from "./data/mockData";

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  in_progress: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-500",
};

export default function AdminAppointments() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = mockAppointments.filter((a) => activeTab === "all" || a.status === activeTab);

  return (
    <AdminLayout title="Appointments">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Appointments</h2>
          <p className="text-gray-400 mt-1">All scheduled and completed consultations</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-full font-bold hover:bg-purple-100 transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Today's Appointments", value: mockStats.appointmentsToday, color: "text-[#7B2D8B]" },
          { label: "Upcoming", value: 1204, color: "text-blue-600" },
          { label: "Completed", value: 8921, color: "text-emerald-600" },
          { label: "Cancelled", value: 143, color: "text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-2xl shadow-sm">
            <p className={`text-3xl font-black ${s.color}`}>{s.value.toLocaleString()}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="p-4 border-b border-gray-50 flex gap-2 flex-wrap">
          {["all", "upcoming", "in_progress", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                activeTab === tab ? "bg-[#7B2D8B] text-white" : "text-gray-400 hover:bg-[#fdf0f9]"
              }`}
            >
              {tab === "all" ? "All" : tab.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fdf0f9]/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Patient</th>
                <th className="px-6 py-5">Doctor</th>
                <th className="px-6 py-5">Date & Time</th>
                <th className="px-6 py-5">Duration</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">{apt.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{apt.patient}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-700">{apt.doctor}</p>
                    <p className="text-xs text-gray-400">{apt.specialty}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-700">{apt.date}</p>
                    <p className="text-xs text-gray-400">{apt.time}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{apt.duration}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[apt.status]}`}>
                      {apt.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-[#7B2D8B] hover:bg-purple-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      {apt.status === "upcoming" && (
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">cancel</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-[#fdf0f9]/30 border-t border-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400 font-medium">Showing {filtered.length} appointments</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#7B2D8B] text-white font-bold text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 font-bold text-xs">2</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
