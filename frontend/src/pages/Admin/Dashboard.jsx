import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import {
  getDashboardStats,
  getRecentActivity,
  getPendingDoctorApplications,
  getNotifications,
} from "../../services/adminService";
import { exportDashboardReport } from "../../utils/exportUtils";

function StatCard({ title, value, trend, trendColor = "text-emerald-600", icon, purple }) {
  return (
    <div className={`p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${purple ? "bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] text-white shadow-purple-300" : "bg-white shadow-sm hover:shadow-purple-200"}`}>
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-12 -mt-12 transition-all duration-500 group-hover:scale-125 group-hover:rotate-45 ${purple ? "bg-white/10" : "bg-gradient-to-br from-purple-100 to-pink-100"}`}></div>
      <div className="flex items-start justify-between relative">
        <div className="flex-1">
          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${purple ? "text-white/80" : "text-gray-400"}`}>{title}</p>
          <h3 className={`text-4xl font-black mb-1 ${purple ? "text-white" : "text-gray-800"}`}>{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1.5 mt-3 text-xs font-bold ${purple ? "text-white/90" : trendColor}`}>
              <span className="material-symbols-outlined text-sm animate-bounce">{trendColor.includes("amber") ? "schedule" : "trending_up"}</span>
              {trend}
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg ${purple ? "bg-white/20" : "bg-gradient-to-br from-[#fdf0f9] to-purple-100"}`}>
          <span className={`material-symbols-outlined text-2xl ${purple ? "text-white" : "text-[#7B2D8B]"}`}>{icon}</span>
        </div>
      </div>
      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-purple-300 transition-all duration-300"></div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateRange, setDateRange] = useState("last_7_days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dateRangeOptions = [
    { value: "last_7_days", label: "Last 7 Days" },
    { value: "last_30_days", label: "Last 30 Days" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "custom", label: "Custom Range" },
  ];

  const getDatesForRange = (range) => {
    const now = new Date();
    let start, end;

    switch (range) {
      case "last_7_days":
        end = now;
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "last_30_days":
        end = now;
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "this_month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = now;
        break;
      case "last_month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      default:
        start = new Date();
        end = now;
    }

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  useEffect(() => {
    const load = async () => {
      const [statsRes, activityRes, doctorsRes, notifsRes] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
        getPendingDoctorApplications(),
        getNotifications(),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (activityRes.data) setActivity(activityRes.data);
      if (doctorsRes.data) setPendingDoctors(doctorsRes.data);
      if (notifsRes.data) setUnreadCount(notifsRes.data.filter(n => !n.read).length);
      setLoading(false);
    };
    load();
  }, []);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    if (range === "custom") {
      // Keep current dates or set defaults
    } else {
      const { start, end } = getDatesForRange(range);
      setStartDate(start);
      setEndDate(end);
    }
  };

  const handleApplyFilter = () => {
    setShowFilterModal(false);
    // In a real app, this would fetch filtered data from backend
    // For now, just close the modal
  };

  const handleCancelFilter = () => {
    setShowFilterModal(false);
    // Reset to last 7 days
    const { start, end } = getDatesForRange("last_7_days");
    setStartDate(start);
    setEndDate(end);
    setDateRange("last_7_days");
  };

  if (loading) return (
    <AdminLayout title="Dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Dashboard">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-black text-[#7B2D8B] flex items-center gap-3">
            <span className="material-symbols-outlined text-5xl animate-pulse">dashboard</span>
            Control Center
          </h2>
          <p className="text-gray-500 mt-2 text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System health and platform metrics • Live updates
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowFilterModal(true)}
              className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#fdf0f9] to-purple-50 text-[#7B2D8B] rounded-xl text-sm font-bold hover:from-purple-100 hover:to-purple-100 transition-all hover:scale-105 shadow-sm border border-purple-100"
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter Range
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
                5
              </span>
            </button>
            
            {/* Filter Modal */}
            {showFilterModal && (
              <>
                <div 
                  className="fixed inset-0 bg-black/50 z-[60]"
                  onClick={() => setShowFilterModal(false)}
                />
                <div className="fixed inset-0 flex items-center justify-center p-4 z-[70]">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Dashboard Data</h3>
                    
                    <div className="space-y-4 mb-6">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Date Range</label>
                      <select 
                        className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                        value={dateRange}
                        onChange={(e) => handleDateRangeChange(e.target.value)}
                      >
                        {dateRangeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      
                      {dateRange === "custom" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Start Date</label>
                            <input 
                              type="date" 
                              className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">End Date</label>
                            <input 
                              type="date" 
                              className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={handleCancelFilter}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleApplyFilter}
                        className="flex-1 px-4 py-3 bg-[#7B2D8B] text-white rounded-xl font-bold text-sm hover:bg-purple-800 transition-colors"
                      >
                        Apply Filter
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <button 
            onClick={() => exportDashboardReport(stats, activity)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-300 hover:shadow-purple-400 hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Patients" value={stats.totalPatients.toLocaleString()} trend="+8.2% vs last month" icon="group" />
          <StatCard title="Active Doctors" value={stats.activeDoctors.toLocaleString()} trend="+4 new today" icon="medical_services" />
          <StatCard title="Appointments Today" value={stats.appointmentsToday} trend="156 pending" trendColor="text-amber-500" icon="calendar_today" />
          <StatCard title="Total Revenue (ETB)" value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`} trend="+22% growth" icon="payments" purple />
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Chart + Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7B2D8B]">show_chart</span>
                  Appointments Over Time
                </h4>
                <p className="text-sm text-gray-500 mt-1">Historical patient volume trends</p>
              </div>
              <select className="bg-gradient-to-r from-[#fdf0f9] to-purple-50 border border-purple-100 rounded-xl text-xs font-bold text-[#7B2D8B] px-4 py-2 focus:outline-none hover:from-purple-100 hover:to-purple-100 transition-all cursor-pointer">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className="h-48 relative group">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B2D8B" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#7B2D8B" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,120 Q50,100 80,80 T160,60 T240,70 T320,40 T400,20" fill="none" stroke="#7B2D8B" strokeWidth="4" strokeLinecap="round" className="drop-shadow-lg" />
                <path d="M0,120 Q50,100 80,80 T160,60 T240,70 T320,40 T400,20 L400,150 L0,150 Z" fill="url(#chartGrad)" />
                {/* Data points */}
                <circle cx="80" cy="80" r="5" fill="#7B2D8B" className="animate-pulse" />
                <circle cx="160" cy="60" r="5" fill="#7B2D8B" className="animate-pulse" style={{animationDelay: "0.2s"}} />
                <circle cx="240" cy="70" r="5" fill="#7B2D8B" className="animate-pulse" style={{animationDelay: "0.4s"}} />
                <circle cx="320" cy="40" r="5" fill="#7B2D8B" className="animate-pulse" style={{animationDelay: "0.6s"}} />
                <circle cx="400" cy="20" r="5" fill="#7B2D8B" className="animate-pulse" style={{animationDelay: "0.8s"}} />
              </svg>
            </div>
            <div className="flex justify-between mt-3 text-xs font-bold text-gray-400">
              <span className="hover:text-[#7B2D8B] transition-colors cursor-pointer">Mon</span>
              <span className="hover:text-[#7B2D8B] transition-colors cursor-pointer">Tue</span>
              <span className="hover:text-[#7B2D8B] transition-colors cursor-pointer">Wed</span>
              <span className="hover:text-[#7B2D8B] transition-colors cursor-pointer">Thu</span>
              <span className="hover:text-[#7B2D8B] transition-colors cursor-pointer">Fri</span>
              <span className="hover:text-[#7B2D8B] transition-colors cursor-pointer">Sat</span>
              <span className="hover:text-[#7B2D8B] transition-colors cursor-pointer">Sun</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200">
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7B2D8B]">history</span>
              Recent Activity
              <span className="ml-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                Live
              </span>
            </h4>
            <div className="space-y-5 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-200 via-purple-100 to-transparent"></div>
              {activity.map((item) => (
                <div key={item.id} className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#fdf0f9] to-purple-100 flex items-center justify-center border-4 border-white z-10 group-hover:scale-125 transition-transform shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] block animate-pulse"></span>
                  </div>
                  <div className="flex justify-between items-start bg-gradient-to-r from-[#fdf0f9]/50 to-transparent p-3 rounded-xl group-hover:from-purple-50 group-hover:to-purple-50/30 transition-all">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.text}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-4 bg-white px-2 py-1 rounded-full">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-gradient-to-r from-[#fdf0f9] to-purple-50 text-[#7B2D8B] text-xs font-bold rounded-xl hover:from-purple-100 hover:to-purple-100 transition-all uppercase tracking-widest border border-purple-100 hover:scale-[1.02] shadow-sm">
              View Complete Audit Log
            </button>
          </div>
        </div>

        {/* Right: Alerts + Queue + Status */}
        <div className="space-y-6">
          {/* Critical Alerts */}
          <div className="bg-gradient-to-br from-red-800 to-red-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-2 border-red-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined animate-pulse">error</span>
              <h4 className="font-bold text-lg">Critical Alerts</h4>
              <span className="ml-auto bg-white/30 text-white text-xs font-black px-3 py-1 rounded-full backdrop-blur-sm shadow-md animate-bounce">{unreadCount}</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white/15 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all border border-white/20 hover:scale-[1.02]">
                <p className="text-xs font-bold opacity-80 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                  Emergency Vitals
                </p>
                <p className="text-sm mt-2 font-medium">Patient Bereket — critical SpO2: 88%. AI flagging urgent review.</p>
                <button
                  onClick={() => navigate("/admin/medical-records")}
                  className="mt-3 px-4 py-2 bg-white text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-all hover:scale-105 shadow-md"
                >
                  Open Medical File →
                </button>
              </div>
              <div className="bg-white/15 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all border border-white/20 hover:scale-[1.02]">
                <p className="text-xs font-bold opacity-80 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></span>
                  Server Latency
                </p>
                <p className="text-sm mt-2 font-medium">High response time on notification relay service.</p>
                <button
                  onClick={() => navigate("/admin/settings")}
                  className="mt-3 px-4 py-2 bg-white text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-all hover:scale-105 shadow-md"
                >
                  Investigate →
                </button>
              </div>
            </div>
          </div>

          {/* Doctor Verification Queue */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7B2D8B]">verified_user</span>
                Verification Queue
              </h4>
              <span className="bg-gradient-to-r from-[#fdf0f9] to-purple-100 text-[#7B2D8B] text-xs font-black px-3 py-1.5 rounded-full border border-purple-200 shadow-sm">
                {pendingDoctors.length} pending
              </span>
            </div>
            {pendingDoctors.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No pending applications</p>
            ) : (
              <div className="space-y-3">
                {pendingDoctors.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="p-3 bg-gradient-to-r from-[#fdf0f9] to-purple-50 rounded-xl hover:from-purple-100 hover:to-purple-100 transition-all border border-purple-100 hover:scale-[1.02]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md">
                        {doc.name.split(" ")[1]?.[0] || "D"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">medical_services</span>
                          {doc.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate("/admin/doctors")}
                        className="flex-1 py-2 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all active:scale-95 shadow-md"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => navigate("/admin/doctors")}
                        className="flex-1 py-2 bg-white text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-200 active:scale-95"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7B2D8B]">monitor_heart</span>
                System Status
              </h4>
              <span className="flex items-center gap-2 text-xs font-bold text-green-600">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-300"></span>
                All Systems Go
              </span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Core API", status: "Operational", ok: true, uptime: "99.9%" },
                { name: "rPPG Processing Hub", status: "Operational", ok: true, uptime: "99.8%" },
                { name: "Push Notification Relay", status: "Degraded", ok: false, uptime: "95.2%" },
                { name: "Database Cluster", status: "Operational", ok: true, uptime: "100%" },
              ].map((s) => (
                <div key={s.name} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:from-purple-50 hover:to-purple-50/30 transition-all group">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.ok ? "bg-green-500 animate-pulse" : "bg-amber-500 animate-pulse"}`}></span>
                    <span className="text-sm text-gray-700 font-medium">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-full">{s.uptime}</span>
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-full ${s.ok ? "text-green-700 bg-green-100" : "text-amber-700 bg-amber-100"}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
