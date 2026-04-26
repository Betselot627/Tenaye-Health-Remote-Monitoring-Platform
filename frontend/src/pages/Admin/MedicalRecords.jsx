import { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import { getMedicalRecordsStats, getCriticalAlerts } from "../../services/adminService";

// Admin sees AGGREGATE stats and critical alerts only — NOT individual patient records
// Individual records are owned by patients and their treating doctors (RLS enforced)

const recordTypeBreakdown = [
  { type: "Consultation Notes", count: 12840, icon: "description", color: "text-blue-600", bg: "bg-blue-50" },
  { type: "Prescriptions", count: 9210, icon: "medication", color: "text-purple-600", bg: "bg-purple-50" },
  { type: "Lab Orders", count: 7430, icon: "science", color: "text-amber-600", bg: "bg-amber-50" },
  { type: "Health Trackers", count: 11200, icon: "monitor_heart", color: "text-emerald-600", bg: "bg-emerald-50" },
  { type: "Vaccinations", count: 3100, icon: "vaccines", color: "text-teal-600", bg: "bg-teal-50" },
  { type: "Vital Alerts", count: 1041, icon: "emergency", color: "text-red-600", bg: "bg-red-50" },
];

export default function AdminMedicalRecords() {
  const [stats, setStats] = useState(null);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [statsRes, alertsRes] = await Promise.all([
        getMedicalRecordsStats(),
        getCriticalAlerts(),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (alertsRes.data) setCriticalAlerts(alertsRes.data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <AdminLayout title="Medical Records">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Medical Records">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Medical Records Oversight</h2>
          <p className="text-gray-400 mt-1">Platform-wide health data statistics and critical alert monitoring</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-full font-bold hover:bg-purple-100 transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Export Report
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <span className="material-symbols-outlined text-blue-500 flex-shrink-0 mt-0.5">info</span>
        <div>
          <p className="text-sm font-semibold text-blue-700">Admin Oversight Mode</p>
          <p className="text-xs text-blue-500 mt-0.5">
            Individual patient records are private and accessible only to patients and their treating doctors.
            This view shows aggregate statistics and critical alerts that require platform-level attention.
          </p>
        </div>
      </div>

      {/* Aggregate Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Records", value: stats.totalRecords.toLocaleString(), color: "text-[#7B2D8B]", icon: "folder_shared" },
            { label: "Critical Alerts", value: stats.criticalAlerts.toString(), color: "text-red-600", bg: "bg-red-50", icon: "emergency" },
            { label: "Records This Week", value: stats.recordsThisWeek.toString(), color: "text-emerald-600", icon: "trending_up" },
            { label: "Pending Lab Orders", value: stats.pendingLabOrders.toString(), color: "text-amber-600", icon: "science" },
          ].map((s) => (
            <div key={s.label} className={`p-6 rounded-2xl shadow-sm ${s.bg || "bg-white"}`}>
              <span className={`material-symbols-outlined ${s.color} mb-3 block`}>{s.icon}</span>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Record Type Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h4 className="text-lg font-bold text-gray-800 mb-6">Records by Type</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {recordTypeBreakdown.map((item) => (
            <div key={item.type} className={`${item.bg} p-4 rounded-xl flex items-center gap-3`}>
              <span className={`material-symbols-outlined ${item.color} text-2xl`}>{item.icon}</span>
              <div>
                <p className={`text-xl font-black ${item.color}`}>{item.count.toLocaleString()}</p>
                <p className="text-xs font-semibold text-gray-500">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Vital Alerts — Admin monitors, system auto-notifies doctor */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-red-600">emergency</span>
          <h4 className="font-bold text-red-700">Critical Vital Alerts</h4>
          {criticalAlerts.length > 0 && (
            <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {criticalAlerts.filter(a => !a.acknowledged).length} unacknowledged
            </span>
          )}
        </div>
        <p className="text-xs text-red-400 mb-4">
          Doctors are automatically notified by the system. This log is for admin oversight only.
        </p>
        {criticalAlerts.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">check_circle</span>
            <p className="text-gray-400 font-medium">No critical alerts at this time</p>
          </div>
        ) : (
          <div className="space-y-3">
          {criticalAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center justify-between bg-white p-4 rounded-xl border ${
                alert.acknowledged ? "border-gray-100 opacity-60" : "border-red-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  alert.acknowledged ? "bg-gray-100" : "bg-red-100"
                }`}>
                  <span className={`material-symbols-outlined text-sm ${
                    alert.acknowledged ? "text-gray-400" : "text-red-600"
                  }`}>
                    {alert.acknowledged ? "check_circle" : "emergency"}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{alert.patient}</p>
                  <p className="text-xs text-red-600 font-semibold">{alert.alert}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Assigned doctor: {alert.doctor} · {alert.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {alert.acknowledged ? (
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    Doctor notified
                  </span>
                ) : (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full animate-pulse">
                    Auto-notifying...
                  </span>
                )}
                <button
                  className="p-2 text-[#7B2D8B] hover:bg-purple-50 rounded-lg transition-colors"
                  title="View Patient File"
                >
                  <span className="material-symbols-outlined text-lg">open_in_new</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </AdminLayout>
  );
}
