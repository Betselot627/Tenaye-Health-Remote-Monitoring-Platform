import { useState, useEffect } from "react";
import DoctorLayout from "./components/DoctorLayout";
import { mockVitalAlerts } from "./data/mockData";

const levelBg = {
  critical: "from-red-800 to-red-700",
  borderline: "from-amber-600 to-amber-500",
  normal: "from-emerald-600 to-emerald-500",
};

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
      ${type === "success" ? "bg-emerald-600" : "bg-[#7B2D8B]"}`}
    >
      <span className="material-symbols-outlined text-lg">check_circle</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

export default function DoctorVitals() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("all");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setAlerts(mockVitalAlerts);
      setLoading(false);
    }, 400);
  }, []);

  if (loading)
    return (
      <DoctorLayout title="Vital Alerts">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DoctorLayout>
    );

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAcknowledge = (alert) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, acknowledged: true } : a)),
    );
    showToast(`Alert for ${alert.patient} acknowledged.`, "success");
  };

  const handleAcknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
    showToast("All alerts acknowledged.", "success");
  };

  const filtered = alerts.filter(
    (a) => filterLevel === "all" || a.level === filterLevel,
  );
  const unacknowledged = alerts.filter((a) => !a.acknowledged);

  return (
    <DoctorLayout title="Vital Alerts">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Vital Alerts</h2>
          <p className="text-gray-400 mt-1">
            Real-time patient vital sign monitoring
          </p>
        </div>
        {unacknowledged.length > 0 && (
          <button
            onClick={handleAcknowledgeAll}
            className="flex items-center gap-2 px-6 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-full font-bold hover:bg-purple-100 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            Acknowledge All
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Critical",
            value: alerts.filter((a) => a.level === "critical").length,
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            label: "Borderline",
            value: alerts.filter((a) => a.level === "borderline").length,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Unacknowledged",
            value: unacknowledged.length,
            color: "text-[#7B2D8B]",
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

      {/* Unacknowledged Banner */}
      {unacknowledged.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-red-600 animate-pulse">
            emergency
          </span>
          <p className="text-sm font-semibold text-red-700">
            {unacknowledged.length} unacknowledged alert(s) require your
            immediate attention.
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["all", "critical", "borderline"].map((level) => (
          <button
            key={level}
            onClick={() => setFilterLevel(level)}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
              filterLevel === level
                ? "bg-[#7B2D8B] text-white"
                : "text-gray-400 hover:bg-[#fdf0f9]"
            }`}
          >
            {level === "all"
              ? "All Alerts"
              : level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-3 py-16 text-center bg-white rounded-2xl shadow-sm">
            <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">
              check_circle
            </span>
            <p className="text-gray-400 font-medium">
              No alerts in this category.
            </p>
          </div>
        ) : (
          filtered.map((alert) => (
            <div
              key={alert.id}
              className={`bg-gradient-to-br ${levelBg[alert.level]} text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${alert.acknowledged ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined ${!alert.acknowledged ? "animate-pulse" : ""}`}
                  >
                    {alert.level === "critical" ? "emergency" : "warning"}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                    {alert.level}
                  </span>
                </div>
                {alert.acknowledged && (
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    Acknowledged
                  </span>
                )}
              </div>

              <div className="mb-4">
                <p className="font-black text-xl">{alert.patient}</p>
                <p className="text-sm opacity-80 mt-1">{alert.metric}</p>
                <p className="text-3xl font-black mt-2">{alert.value}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs opacity-70">{alert.time}</span>
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition-all backdrop-blur-sm"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DoctorLayout>
  );
}
