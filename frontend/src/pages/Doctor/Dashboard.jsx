import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "./components/DoctorLayout";
import {
  mockDoctorStats,
  mockDoctorAppointments,
  mockActivity,
  mockVitalAlerts,
  mockWeeklyEarnings,
  mockMonthlyPatients,
} from "./data/mockData";

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  in_progress: "bg-teal-100 text-teal-700",
  cancelled: "bg-red-100 text-red-700",
};

//  same pattern as Patient MetricTile 
function MetricTile({ label, value, icon, color, bg, trend, trendUp = true }) {
  return (
    <div className={`${bg} rounded-2xl p-5 border border-white hover:shadow-md transition-all cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "22" }}>
          <span className="material-symbols-outlined text-xl" style={{ color }}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-bold flex items-center gap-0.5 ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
            <span className="material-symbols-outlined text-sm">{trendUp ? "arrow_upward" : "arrow_downward"}</span>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 font-semibold mt-0.5">{label}</p>
    </div>
  );
}

//  same pattern as Patient RingCard 
function RingCard({ label, value, unit, max, color, icon, status, statusOk }) {
  const r = 26, circ = 2 * Math.PI * r;
  const dash = Math.min(value / max, 1) * circ;
  return (
    <div className="bg-white rounded-2xl p-4 border border-teal-100 hover:border-teal-300 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer group">
      <div className="relative w-16 h-16 mb-2">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#e0f2f1" strokeWidth="5" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-base" style={{ color }}>{icon}</span>
        </div>
      </div>
      <p className="text-base font-black text-gray-800">
        {value}<span className="text-[10px] font-normal text-gray-400 ml-0.5">{unit}</span>
      </p>
      <p className="text-[10px] font-bold text-gray-500 mt-0.5">{label}</p>
      {status && (
        <span className={`text-[10px] mt-1 font-bold px-2 py-0.5 rounded-full ${statusOk ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
          {status}
        </span>
      )}
    </div>
  );
}

//  dual-line SVG chart  earnings + patient growth (mirrors Patient VitalsChart) 
function EarningsChart({ earnings, patients }) {
  if (!earnings.length) return null;
  const W = 400, H = 110, PAD = 20;
  const maxE = Math.max(...earnings.map((d) => d.amount));
  const maxP = Math.max(...patients.map((d) => d.count));
  const ePts = earnings.map((d, i) => [
    PAD + (i / (earnings.length - 1)) * (W - PAD * 2),
    H - PAD - ((d.amount / maxE) * (H - PAD * 2)),
  ]);
  const pPts = patients.map((d, i) => [
    PAD + (i / (patients.length - 1)) * (W - PAD * 2),
    H - PAD - ((d.count / maxP) * (H - PAD * 2)),
  ]);
  const ePath = ePts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const pPath = pPts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  return (
    <svg className="w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="eFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D7377" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0D7377" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 60, 90].map((y) => (
        <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#e0f2f1" strokeWidth="1" />
      ))}
      <path d={ePath + ` L${ePts[ePts.length-1][0]},${H} L${ePts[0][0]},${H} Z`} fill="url(#eFill)" />
      <path d={ePath} fill="none" stroke="#0D7377" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={pPath} fill="none" stroke="#14A085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
      {ePts.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill="#0D7377" stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState({ patients: 0, appointmentsToday: 0, labOrders: 0, earnings: 0 });

  useEffect(() => {
    setTimeout(() => {
      setStats(mockDoctorStats);
      setAppointments(mockDoctorAppointments.filter((a) => a.status === "upcoming").slice(0, 3));
      setActivity(mockActivity);
      setAlerts(mockVitalAlerts.filter((a) => !a.acknowledged));
      setLoading(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (!stats) return;
    const steps = 40, iv = 1200 / steps;
    let s = 0;
    const t = setInterval(() => {
      s++;
      const e = 1 - Math.pow(1 - s / steps, 3);
      setCounters({
        patients: Math.round(stats.totalPatients * e),
        appointmentsToday: Math.round(stats.appointmentsToday * e),
        labOrders: Math.round(stats.pendingLabOrders * e),
        earnings: Math.round(stats.monthlyEarnings * e),
      });
      if (s >= steps) clearInterval(t);
    }, iv);
    return () => clearInterval(t);
  }, [stats]);

  if (loading)
    return (
      <DoctorLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[#0D7377] border-t-transparent rounded-full animate-spin" />
        </div>
      </DoctorLayout>
    );

  return (
    <DoctorLayout title="Dashboard">
      <div className="space-y-6">

        {/*  Welcome Banner  */}
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white"
          style={{ background: "linear-gradient(135deg,#083d40 0%,#0D7377 55%,#14A085 100%)" }}>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full -mr-24 -mt-24 bg-white/5" />
          <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full -mb-20 bg-white/5" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-white/80 text-lg">stethoscope</span>
                <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                  Doctor Portal  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black">Good morning, Dr. Amanuel </h2>
              <p className="text-white/70 mt-1.5 text-sm">
                You have{" "}
                <span className="text-white font-bold">
                  {counters.appointmentsToday} appointment{counters.appointmentsToday !== 1 ? "s" : ""} today
                </span>{" "}
                 {alerts.length > 0 ? `${alerts.length} vital alert${alerts.length !== 1 ? "s" : ""} need attention` : "All vitals normal"}
              </p>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm text-white/80">group</span>
                  {counters.patients} Patients
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm text-white/80">biotech</span>
                  {counters.labOrders} Pending Labs
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 text-xs font-semibold">
                  <span className="material-symbols-outlined text-sm text-white/80">payments</span>
                  {counters.earnings.toLocaleString()} ETB / mo
                </div>
              </div>
            </div>
            <button onClick={() => navigate("/doctor/appointments")}
              className="flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 text-white rounded-xl text-sm font-bold border border-white/20 hover:scale-105 transition-all self-start md:self-auto backdrop-blur-sm">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              View Schedule
            </button>
          </div>
        </div>

        {/*  Metric Tiles  */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricTile label="Total Patients" value={counters.patients} icon="group" color="#0D7377" bg="bg-teal-50" trend="+12 this month" />
          <MetricTile label="Today's Appointments" value={counters.appointmentsToday} icon="calendar_today" color="#3b82f6" bg="bg-blue-50" trend="Next: 10:00 AM" />
          <MetricTile label="Pending Lab Orders" value={counters.labOrders} icon="biotech" color="#7c3aed" bg="bg-violet-50" trend="2 urgent" trendUp={false} />
          <MetricTile label="Monthly Earnings" value={counters.earnings.toLocaleString() + " ETB"} icon="payments" color="#059669" bg="bg-emerald-50" trend="+2,400 ETB" />
        </div>

        {/*  Main Grid  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/*  Dual-line chart (mirrors Patient VitalsChart card)  */}
            <div className="bg-white rounded-2xl border border-teal-100 hover:shadow-lg transition-all p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0D7377]">trending_up</span>
                    Performance Overview
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Weekly earnings & 6-month patient growth</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-[#0D7377] font-bold">
                    <span className="w-4 h-0.5 bg-[#0D7377] inline-block rounded" />
                    Earnings
                  </span>
                  <span className="flex items-center gap-1.5 text-[#14A085] font-bold">
                    <span className="w-4 h-0.5 border-t-2 border-dashed border-[#14A085] inline-block" />
                    Patients
                  </span>
                </div>
              </div>
              <div className="h-28">
                <EarningsChart earnings={mockWeeklyEarnings} patients={mockMonthlyPatients} />
              </div>
              <div className="flex justify-between mt-1 text-[10px] font-bold text-gray-400 px-5">
                {mockWeeklyEarnings.map((d) => <span key={d.day}>{d.day}</span>)}
              </div>
              <div className="flex justify-between mt-3 text-xs text-gray-400">
                <span>Earnings: <span className="font-bold text-[#0D7377]">{Math.min(...mockWeeklyEarnings.map((d) => d.amount)).toLocaleString()}{Math.max(...mockWeeklyEarnings.map((d) => d.amount)).toLocaleString()} ETB</span></span>
                <span>Patients: <span className="font-bold text-[#14A085]">{mockMonthlyPatients[0].count}{mockMonthlyPatients[mockMonthlyPatients.length-1].count}</span></span>
              </div>
            </div>

            {/*  Ring Cards (mirrors Patient vital rings)  */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0D7377] text-lg">vital_signs</span>
                  Today at a Glance
                </h3>
                <button onClick={() => navigate("/doctor/vitals")} className="text-xs text-[#0D7377] font-bold hover:underline">
                  Vital alerts 
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <RingCard label="Patients" value={counters.patients} unit="" max={200} color="#0D7377" icon="group" status="Active" statusOk={true} />
                <RingCard label="Appointments" value={counters.appointmentsToday} unit="" max={10} color="#3b82f6" icon="calendar_today" status={counters.appointmentsToday > 0 ? "Scheduled" : "None"} statusOk={counters.appointmentsToday > 0} />
                <RingCard label="Lab Orders" value={counters.labOrders} unit="" max={10} color="#7c3aed" icon="biotech" status={counters.labOrders > 0 ? "Pending" : "Clear"} statusOk={counters.labOrders === 0} />
                <RingCard label="Alerts" value={alerts.length} unit="" max={5} color={alerts.length > 0 ? "#ef4444" : "#059669"} icon="emergency" status={alerts.length > 0 ? "Critical" : "Normal"} statusOk={alerts.length === 0} />
              </div>
            </div>

            {/*  Upcoming Appointments  */}
            <div className="bg-white rounded-2xl border border-teal-100 hover:shadow-lg transition-all p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0D7377]">today</span>
                  Upcoming Appointments
                </h3>
                <span className="text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-pulse"
                  style={{ background: "linear-gradient(135deg,#0D7377,#14A085)" }}>
                  {appointments.length} Scheduled
                </span>
              </div>
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-gray-200">calendar_today</span>
                  <p className="text-gray-400 text-sm mt-2">No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl border border-teal-100 hover:border-teal-300 hover:bg-teal-50/30 transition-all group">
                      <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 text-white"
                        style={{ background: "linear-gradient(135deg,#0D7377,#14A085)" }}>
                        <span className="text-sm font-black leading-none">{apt.date.split("-")[2]}</span>
                        <span className="text-[10px] opacity-80">{new Date(apt.date).toLocaleString("en-US", { month: "short" })}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">{apt.patient}</p>
                        <p className="text-xs text-gray-400">{apt.time}  {apt.type}  {apt.duration}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[apt.status]}`}>
                          {apt.status.replace("_", " ")}
                        </span>
                        <button onClick={() => navigate("/doctor/appointments")}
                          className="p-1.5 rounded-lg text-white hover:opacity-90 transition-colors"
                          style={{ background: "linear-gradient(135deg,#0D7377,#14A085)" }}>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => navigate("/doctor/appointments")}
                className="w-full mt-4 py-2.5 bg-teal-50 text-[#0D7377] text-xs font-bold rounded-xl hover:bg-teal-100 transition-all uppercase tracking-widest border border-teal-100">
                View All Appointments
              </button>
            </div>
          </div>

          {/*  Right Column  */}
          <div className="space-y-5">

            {/* Performance Score (mirrors Patient Health Score) */}
            <div className="rounded-2xl p-5 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,#083d40 0%,#0D7377 60%,#14A085 100%)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 bg-white/10" />
              <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Performance Score</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black">92</span>
                <span className="text-white/70 text-sm mb-1">/ 100</span>
              </div>
              <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: "92%" }} />
              </div>
              <p className="text-xs text-white/70 mt-2">Excellent  top 10% of doctors this month</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[{ label: "Attendance", val: "100%" }, { label: "Rating", val: "4.8" }, { label: "Response", val: "Fast" }].map(({ label, val }) => (
                  <div key={label} className="bg-white/15 rounded-xl py-2">
                    <p className="text-xs font-black">{val}</p>
                    <p className="text-[10px] text-white/60">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Alerts */}
            {alerts.length > 0 && (
              <div className="bg-white rounded-2xl border border-red-100 hover:shadow-lg transition-all p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 animate-pulse">emergency</span>
                  Vital Alerts
                </h3>
                <div className="space-y-2">
                  {alerts.map((a) => (
                    <div key={a.id} className={`flex items-center justify-between p-2.5 rounded-xl border ${a.level === "critical" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                      <div>
                        <p className={`text-xs font-bold ${a.level === "critical" ? "text-red-700" : "text-amber-700"}`}>{a.patient}</p>
                        <p className="text-[10px] text-gray-500">{a.metric}: {a.value}</p>
                      </div>
                      <span className="text-[10px] text-gray-400">{a.time}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate("/doctor/vitals")}
                  className="w-full mt-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-all border border-red-100">
                  View All Alerts
                </button>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-teal-100 hover:shadow-lg transition-all p-5">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0D7377]">history</span>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {activity.map((a) => (
                  <div key={a.id} className="flex gap-3 group">
                    <div className="w-7 h-7 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-teal-300 transition-colors">
                      <span className="w-2 h-2 rounded-full bg-[#0D7377] block" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 leading-snug">{a.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{a.sub}</p>
                      <span className="text-[10px] text-teal-500 font-semibold">{a.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-teal-100 p-5">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0D7377]">bolt</span>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Patients", icon: "group", path: "/doctor/patients" },
                  { label: "Lab Orders", icon: "biotech", path: "/doctor/lab-orders" },
                  { label: "Prescriptions", icon: "medication", path: "/doctor/prescriptions" },
                  { label: "Earnings", icon: "payments", path: "/doctor/earnings" },
                ].map(({ label, icon, path }) => (
                  <button key={path} onClick={() => navigate(path)}
                    className="flex flex-col items-center gap-1 p-3 bg-teal-50 rounded-xl hover:bg-teal-100 transition-all hover:scale-105 border border-teal-100 group">
                    <span className="material-symbols-outlined text-[#0D7377] text-xl group-hover:scale-110 transition-transform">{icon}</span>
                    <span className="text-[11px] font-semibold text-gray-600">{label}</span>
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
