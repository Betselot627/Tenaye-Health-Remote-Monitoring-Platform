import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "./components/DoctorLayout";
import {
  mockDoctorStats,
  mockDoctorAppointments,
  mockActivity,
  mockVitalAlerts,
} from "./data/mockData";

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  in_progress: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

function StatCard({
  label,
  value,
  icon,
  purple,
  trend,
  trendColor = "text-emerald-500",
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl
        ${
          purple
            ? "bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] text-white shadow-purple-300 shadow-lg"
            : "bg-white shadow-sm hover:shadow-purple-200 border border-gray-100"
        }`}
    >
      {/* Background orb */}
      <div
        className={`absolute top-0 right-0 w-28 h-28 rounded-full -mr-10 -mt-10 transition-all duration-500 group-hover:scale-125 group-hover:rotate-45
          ${purple ? "bg-white/10" : "bg-gradient-to-br from-purple-100 to-pink-100"}`}
      />
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-300 transition-all duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p
            className={`text-xs font-bold uppercase tracking-wider mb-2 ${purple ? "text-white/80" : "text-gray-400"}`}
          >
            {label}
          </p>
          <h3
            className={`text-4xl font-black mb-1 ${purple ? "text-white" : "text-gray-800"}`}
          >
            {value}
          </h3>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-xs font-bold ${purple ? "text-white/90" : trendColor}`}
            >
              <span className="material-symbols-outlined text-sm animate-bounce">
                trending_up
              </span>
              {trend}
            </div>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12
            ${purple ? "bg-white/20" : "bg-gradient-to-br from-[#fdf0f9] to-purple-100"}`}
        >
          <span
            className={`material-symbols-outlined text-2xl ${purple ? "text-white" : "text-[#7B2D8B]"}`}
          >
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState({
    patients: 0,
    appointments: 0,
    labs: 0,
    earnings: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats(mockDoctorStats);
      setAppointments(mockDoctorAppointments.slice(0, 4));
      setActivity(mockActivity);
      setAlerts(mockVitalAlerts.filter((a) => !a.acknowledged));
      setLoading(false);
    }, 400);
  }, []);

  // Animate counters after load
  useEffect(() => {
    if (!stats) return;
    const duration = 1200;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounters({
        patients: Math.round(stats.totalPatients * ease),
        appointments: Math.round(stats.appointmentsToday * ease),
        labs: Math.round(stats.pendingLabOrders * ease),
        earnings: Math.round(stats.monthlyEarnings * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [stats]);

  if (loading)
    return (
      <DoctorLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin" />
        </div>
      </DoctorLayout>
    );

  return (
    <DoctorLayout title="Dashboard">
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#7B2D8B] flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl animate-pulse">
                dashboard
              </span>
              Doctor Dashboard
            </h2>
            <p className="text-gray-400 mt-1 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live overview ·{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => navigate("/doctor/appointments")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-300 hover:shadow-purple-400 hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined text-sm">
              calendar_today
            </span>
            View All Appointments
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Patients"
            value={counters.patients}
            icon="group"
            trend="+5 this week"
          />
          <StatCard
            label="Today's Appointments"
            value={counters.appointments}
            icon="calendar_today"
            trend="2 in progress"
            trendColor="text-blue-500"
          />
          <StatCard
            label="Pending Lab Orders"
            value={counters.labs}
            icon="biotech"
            trend="Review needed"
            trendColor="text-amber-500"
          />
          <StatCard
            label="Monthly Earnings"
            value={`${counters.earnings.toLocaleString()} ETB`}
            icon="payments"
            purple
            trend="+12% vs last month"
          />
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left col — chart + appointments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointments chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7B2D8B]">
                      show_chart
                    </span>
                    Appointments This Week
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Daily patient volume
                  </p>
                </div>
                <span className="bg-gradient-to-r from-[#fdf0f9] to-purple-50 text-[#7B2D8B] text-xs font-bold px-3 py-1.5 rounded-full border border-purple-100">
                  This Week
                </span>
              </div>
              <div className="h-40 relative">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 130"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="docChartGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7B2D8B"
                        stopOpacity="0.25"
                      />
                      <stop offset="100%" stopColor="#7B2D8B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,110 Q40,90 70,70 T140,50 T210,65 T280,30 T350,45 T400,20"
                    fill="none"
                    stroke="#7B2D8B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-md"
                  />
                  <path
                    d="M0,110 Q40,90 70,70 T140,50 T210,65 T280,30 T350,45 T400,20 L400,130 L0,130 Z"
                    fill="url(#docChartGrad)"
                  />
                  {[
                    [70, 70],
                    [140, 50],
                    [210, 65],
                    [280, 30],
                    [350, 45],
                    [400, 20],
                  ].map(([cx, cy], i) => (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r="5"
                      fill="#7B2D8B"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </svg>
              </div>
              <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span
                    key={d}
                    className="hover:text-[#7B2D8B] transition-colors cursor-default"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Today's appointments list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7B2D8B]">
                    today
                  </span>
                  Today's Appointments
                </h3>
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {appointments.map((apt, i) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-[#fdf0f9]/50 to-transparent rounded-xl hover:from-purple-50 hover:to-purple-50/30 transition-all group border border-transparent hover:border-purple-100"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fdf0f9] to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <span className="material-symbols-outlined text-[#7B2D8B] text-lg">
                          person
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {apt.patient}
                        </p>
                        <p className="text-xs text-gray-400">
                          {apt.time} · {apt.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[apt.status]}`}
                      >
                        {apt.status.replace("_", " ")}
                      </span>
                      {apt.status === "upcoming" && (
                        <button
                          onClick={() =>
                            navigate(`/consultation/room-${apt.id}`)
                          }
                          className="p-1.5 rounded-lg bg-[#7B2D8B] text-white hover:bg-[#6a2578] transition-colors hover:scale-110"
                        >
                          <span className="material-symbols-outlined text-sm">
                            videocam
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/doctor/appointments")}
                className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#fdf0f9] to-purple-50 text-[#7B2D8B] text-xs font-bold rounded-xl hover:from-purple-100 hover:to-purple-100 transition-all uppercase tracking-widest border border-purple-100 hover:scale-[1.01]"
              >
                View All Appointments
              </button>
            </div>
          </div>

          {/* Right col */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            <div className="bg-gradient-to-br from-red-800 to-red-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-red-500">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined animate-pulse">
                  emergency
                </span>
                <h3 className="font-bold text-lg">Critical Alerts</h3>
                <span className="ml-auto bg-white/30 text-white text-xs font-black px-3 py-1 rounded-full backdrop-blur-sm animate-bounce">
                  {alerts.length}
                </span>
              </div>
              {alerts.length === 0 ? (
                <p className="text-sm text-white/70 text-center py-4">
                  No active alerts
                </p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((a) => (
                    <div
                      key={a.id}
                      className="bg-white/15 backdrop-blur-sm p-3 rounded-xl hover:bg-white/20 transition-all border border-white/20 hover:scale-[1.02]"
                    >
                      <p className="text-xs font-bold opacity-80 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                        {a.level === "critical" ? "Critical" : "Borderline"}
                      </p>
                      <p className="text-sm mt-1 font-semibold">{a.patient}</p>
                      <p className="text-xs opacity-80">
                        {a.metric}: {a.value}
                      </p>
                      <button
                        onClick={() => navigate("/doctor/vitals")}
                        className="mt-2 px-3 py-1.5 bg-white text-red-700 text-xs font-bold rounded-lg hover:bg-red-50 transition-all hover:scale-105 shadow-md"
                      >
                        Review Vitals →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-6">
              <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7B2D8B]">
                  history
                </span>
                Recent Activity
              </h3>
              <div className="space-y-4 relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-200 via-purple-100 to-transparent" />
                {activity.map((a, i) => (
                  <div key={a.id} className="relative pl-9 group">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#fdf0f9] to-purple-100 flex items-center justify-center border-4 border-white z-10 group-hover:scale-125 transition-transform shadow-sm">
                      <span
                        className="w-2 h-2 rounded-full bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] block animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    </div>
                    <div className="bg-gradient-to-r from-[#fdf0f9]/50 to-transparent p-2.5 rounded-xl group-hover:from-purple-50 transition-all">
                      <p className="text-sm font-bold text-gray-800">
                        {a.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.sub}</p>
                      <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full mt-1 inline-block">
                        {a.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7B2D8B]">
                  bolt
                </span>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Patients",
                    icon: "group",
                    path: "/doctor/patients",
                  },
                  {
                    label: "Prescriptions",
                    icon: "medication",
                    path: "/doctor/prescriptions",
                  },
                  {
                    label: "Lab Orders",
                    icon: "biotech",
                    path: "/doctor/lab-orders",
                  },
                  {
                    label: "Schedule",
                    icon: "event_available",
                    path: "/doctor/schedule",
                  },
                ].map(({ label, icon, path }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="flex flex-col items-center gap-1.5 p-3 bg-gradient-to-br from-[#fdf0f9] to-purple-50 rounded-xl hover:from-purple-100 hover:to-purple-100 transition-all hover:scale-105 group border border-purple-100"
                  >
                    <span className="material-symbols-outlined text-[#7B2D8B] text-xl group-hover:scale-110 transition-transform">
                      {icon}
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
