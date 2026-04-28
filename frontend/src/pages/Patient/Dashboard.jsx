import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "./components/PatientLayout";
import {
  mockPatientStats,
  mockPatientAppointments,
  mockPatientActivity,
  mockVitals,
  mockPatientPrescriptions,
} from "./data/mockData";

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
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
      ${purple ? "bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] text-white shadow-purple-300 shadow-lg" : "bg-white shadow-sm hover:shadow-purple-200 border border-gray-100"}`}
    >
      <div
        className={`absolute top-0 right-0 w-28 h-28 rounded-full -mr-10 -mt-10 transition-all duration-500 group-hover:scale-125 group-hover:rotate-45
        ${purple ? "bg-white/10" : "bg-gradient-to-br from-purple-100 to-pink-100"}`}
      />
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

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState({
    appointments: 0,
    prescriptions: 0,
    labs: 0,
    spent: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats(mockPatientStats);
      setAppointments(
        mockPatientAppointments
          .filter((a) => a.status === "upcoming")
          .slice(0, 3),
      );
      setActivity(mockPatientActivity);
      setVitals(mockVitals.slice(0, 5));
      setPrescriptions(
        mockPatientPrescriptions
          .filter((p) => p.status === "active")
          .slice(0, 3),
      );
      setLoading(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (!stats) return;
    const duration = 1200,
      steps = 40,
      interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setCounters({
        appointments: Math.round(stats.upcomingAppointments * ease),
        prescriptions: Math.round(stats.activePrescriptions * ease),
        labs: Math.round(stats.pendingLabResults * ease),
        spent: Math.round(stats.totalSpent * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [stats]);

  if (loading)
    return (
      <PatientLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin" />
        </div>
      </PatientLayout>
    );

  const latestVital = vitals[0];

  return (
    <PatientLayout title="Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#7B2D8B] flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl animate-pulse">
                dashboard
              </span>
              Patient Dashboard
            </h2>
            <p className="text-gray-400 mt-1 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Welcome back, Bereket ·{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => navigate("/patient/appointments")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-300 hover:shadow-purple-400 hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined text-sm">
              add_circle
            </span>
            Book Appointment
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Upcoming Appointments"
            value={counters.appointments}
            icon="calendar_today"
            trend="Next: Apr 30"
            trendColor="text-blue-500"
          />
          <StatCard
            label="Active Prescriptions"
            value={counters.prescriptions}
            icon="medication"
            trend="1 expiring soon"
            trendColor="text-amber-500"
          />
          <StatCard
            label="Pending Lab Results"
            value={counters.labs}
            icon="biotech"
            trend="CBC pending"
            trendColor="text-orange-500"
          />
          <StatCard
            label="Total Spent"
            value={`${counters.spent.toLocaleString()} ETB`}
            icon="payments"
            purple
            trend="+500 ETB this month"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — chart + upcoming appointments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vitals trend chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7B2D8B]">
                      monitor_heart
                    </span>
                    Heart Rate Trend
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Last 5 readings
                  </p>
                </div>
                <button
                  onClick={() => navigate("/patient/vitals")}
                  className="bg-gradient-to-r from-[#fdf0f9] to-purple-50 text-[#7B2D8B] text-xs font-bold px-3 py-1.5 rounded-full border border-purple-100 hover:from-purple-100 transition-all"
                >
                  View All
                </button>
              </div>
              <div className="h-40 relative">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 130"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="patChartGrad"
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
                    d="M0,60 Q80,40 100,55 T200,45 T300,50 T400,35"
                    fill="none"
                    stroke="#7B2D8B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-md"
                  />
                  <path
                    d="M0,60 Q80,40 100,55 T200,45 T300,50 T400,35 L400,130 L0,130 Z"
                    fill="url(#patChartGrad)"
                  />
                  {[
                    [0, 60],
                    [100, 55],
                    [200, 45],
                    [300, 50],
                    [400, 35],
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
                {vitals.slice(0, 5).map((v) => (
                  <span
                    key={v.date}
                    className="hover:text-[#7B2D8B] transition-colors cursor-default"
                  >
                    {v.date}
                  </span>
                ))}
              </div>
              {/* Latest vitals row */}
              {latestVital && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[
                    {
                      label: "Blood Pressure",
                      value: latestVital.bp,
                      unit: "mmHg",
                      icon: "favorite",
                      color: "text-red-500",
                    },
                    {
                      label: "Heart Rate",
                      value: latestVital.hr,
                      unit: "BPM",
                      icon: "monitor_heart",
                      color: "text-pink-500",
                    },
                    {
                      label: "SpO₂",
                      value: latestVital.spo2,
                      unit: "%",
                      icon: "air",
                      color: "text-blue-500",
                    },
                    {
                      label: "Temp",
                      value: latestVital.temp,
                      unit: "°C",
                      icon: "thermostat",
                      color: "text-amber-500",
                    },
                  ].map(({ label, value, unit, icon, color }) => (
                    <div
                      key={label}
                      className="bg-gradient-to-br from-[#fdf0f9]/60 to-purple-50/40 rounded-xl p-3 text-center border border-purple-50"
                    >
                      <span
                        className={`material-symbols-outlined text-lg ${color}`}
                      >
                        {icon}
                      </span>
                      <p className="text-sm font-black text-gray-800 mt-1">
                        {value}
                        <span className="text-[10px] font-normal text-gray-400 ml-0.5">
                          {unit}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7B2D8B]">
                    today
                  </span>
                  Upcoming Appointments
                </h3>
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
                  {appointments.length} Scheduled
                </span>
              </div>
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-gray-200">
                    calendar_today
                  </span>
                  <p className="text-gray-400 text-sm mt-2">
                    No upcoming appointments
                  </p>
                  <button
                    onClick={() => navigate("/patient/doctors")}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-xs font-bold rounded-xl hover:scale-105 transition-all"
                  >
                    Find a Doctor
                  </button>
                </div>
              ) : (
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
                            stethoscope
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {apt.doctor}
                          </p>
                          <p className="text-xs text-gray-400">
                            {apt.date} · {apt.time} · {apt.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[apt.status]}`}
                        >
                          {apt.status}
                        </span>
                        <button
                          onClick={() => navigate("/patient/appointments")}
                          className="p-1.5 rounded-lg bg-[#7B2D8B] text-white hover:bg-[#6a2578] transition-colors hover:scale-110"
                        >
                          <span className="material-symbols-outlined text-sm">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => navigate("/patient/appointments")}
                className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#fdf0f9] to-purple-50 text-[#7B2D8B] text-xs font-bold rounded-xl hover:from-purple-100 hover:to-purple-100 transition-all uppercase tracking-widest border border-purple-100 hover:scale-[1.01]"
              >
                View All Appointments
              </button>
            </div>
          </div>

          {/* Right col */}
          <div className="space-y-6">
            {/* Active Prescriptions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7B2D8B]">
                  medication
                </span>
                Active Prescriptions
              </h3>
              <div className="space-y-3">
                {prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-3 bg-gradient-to-r from-[#fdf0f9]/50 to-transparent rounded-xl border border-purple-50 hover:border-purple-200 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {rx.medication}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {rx.dosage} · {rx.duration}
                        </p>
                        <p className="text-xs text-gray-400">{rx.doctor}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                      <span className="material-symbols-outlined text-sm">
                        schedule
                      </span>
                      Expires {rx.expiryDate}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/patient/prescriptions")}
                className="w-full mt-3 py-2 bg-gradient-to-r from-[#fdf0f9] to-purple-50 text-[#7B2D8B] text-xs font-bold rounded-xl hover:from-purple-100 transition-all border border-purple-100"
              >
                View All Prescriptions
              </button>
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

            {/* Quick Actions */}
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
                    label: "Find Doctor",
                    icon: "medical_services",
                    path: "/patient/doctors",
                  },
                  {
                    label: "Lab Results",
                    icon: "biotech",
                    path: "/patient/lab-results",
                  },
                  {
                    label: "My Vitals",
                    icon: "monitor_heart",
                    path: "/patient/vitals",
                  },
                  {
                    label: "Billing",
                    icon: "payments",
                    path: "/patient/billing",
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
    </PatientLayout>
  );
}
