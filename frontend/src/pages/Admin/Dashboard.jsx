import AdminLayout from "./components/AdminLayout";
import { mockStats, mockActivity, mockDoctors, mockNotifications } from "./data/mockData";

function StatCard({ title, value, trend, trendColor = "text-emerald-600", icon, purple }) {
  return (
    <div className={`p-6 rounded-2xl relative overflow-hidden group ${purple ? "bg-[#7B2D8B] text-white" : "bg-white"}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110 ${purple ? "bg-white/10" : "bg-purple-50"}`}></div>
      <div className="flex items-start justify-between relative">
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${purple ? "text-white/70" : "text-gray-400"}`}>{title}</p>
          <h3 className={`text-3xl font-black ${purple ? "text-white" : "text-gray-800"}`}>{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1 mt-3 text-xs font-bold ${purple ? "text-white/80" : trendColor}`}>
              <span className="material-symbols-outlined text-xs">trending_up</span>
              {trend}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${purple ? "bg-white/20" : "bg-[#fdf0f9]"}`}>
          <span className={`material-symbols-outlined ${purple ? "text-white" : "text-[#7B2D8B]"}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const pendingDoctors = mockDoctors.filter(d => d.status === "pending");
  const unreadNotifs = mockNotifications.filter(n => !n.read);

  return (
    <AdminLayout title="Dashboard">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Control Center Overview</h2>
          <p className="text-gray-400 mt-1">System health and platform metrics for today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#fdf0f9] text-[#7B2D8B] rounded-full text-sm font-semibold hover:bg-purple-100 transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#7B2D8B] text-white rounded-full text-sm font-semibold shadow-lg shadow-purple-200 hover:bg-purple-800 transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Patients" value={mockStats.totalPatients.toLocaleString()} trend="+8.2% vs last month" icon="group" />
        <StatCard title="Active Doctors" value={mockStats.activeDoctors.toLocaleString()} trend="+4 new today" icon="medical_services" />
        <StatCard title="Appointments Today" value={mockStats.appointmentsToday} trend="156 pending" trendColor="text-amber-500" icon="calendar_today" />
        <StatCard title="Total Revenue (ETB)" value={`${(mockStats.totalRevenue / 1000000).toFixed(1)}M`} trend="+22% growth" icon="payments" purple />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Charts placeholder + Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-bold text-gray-800">Appointments Over Time</h4>
                <p className="text-sm text-gray-400">Historical patient volume</p>
              </div>
              <select className="bg-[#fdf0f9] border-none rounded-full text-xs font-bold text-[#7B2D8B] px-4 py-2 focus:outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            {/* SVG Chart */}
            <div className="h-48 relative">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B2D8B" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#7B2D8B" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,120 Q50,100 80,80 T160,60 T240,70 T320,40 T400,20" fill="none" stroke="#7B2D8B" strokeWidth="3" strokeLinecap="round" />
                <path d="M0,120 Q50,100 80,80 T160,60 T240,70 T320,40 T400,20 L400,150 L0,150 Z" fill="url(#chartGrad)" />
              </svg>
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-gray-400">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h4>
            <div className="space-y-5 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-100"></div>
              {mockActivity.map((item) => (
                <div key={item.id} className="relative pl-10">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#fdf0f9] flex items-center justify-center border-4 border-white z-10">
                    <span className="w-2 h-2 rounded-full bg-[#7B2D8B] block"></span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.text}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 whitespace-nowrap ml-4">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-[#fdf0f9] text-[#7B2D8B] text-xs font-bold rounded-xl hover:bg-purple-100 transition-colors uppercase tracking-widest">
              View Audit Log
            </button>
          </div>
        </div>

        {/* Right: Alerts + Doctor Queue */}
        <div className="space-y-6">
          {/* Critical Alerts */}
          <div className="bg-[#9b1e14] text-white p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined">error</span>
              <h4 className="font-bold">Critical Alerts</h4>
              <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadNotifs.length}</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-xs font-bold opacity-70 uppercase tracking-tighter">Emergency Vitals</p>
                <p className="text-sm mt-1">Patient Bereket — critical SpO2: 88%. AI flagging urgent review.</p>
                <button className="mt-2 text-xs font-bold underline">Open Medical File</button>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-xs font-bold opacity-70 uppercase tracking-tighter">Server Latency</p>
                <p className="text-sm mt-1">High response time on notification relay service.</p>
                <button className="mt-2 text-xs font-bold underline">Investigate</button>
              </div>
            </div>
          </div>

          {/* Doctor Verification Queue */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">Verification Queue</h4>
              <span className="bg-[#fdf0f9] text-[#7B2D8B] text-xs font-bold px-3 py-1 rounded-full">{pendingDoctors.length} pending</span>
            </div>
            <div className="space-y-3">
              {pendingDoctors.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-[#fdf0f9] rounded-xl group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#7B2D8B] flex items-center justify-center text-white font-bold text-sm">
                      {doc.name.split(" ")[1]?.[0] || "D"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{doc.name}</p>
                      <p className="text-xs text-gray-400">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1 bg-[#7B2D8B] text-white text-xs font-bold rounded-full">Approve</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">System Status</h4>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Core API", status: "Operational", ok: true },
                { name: "rPPG Processing Hub", status: "Operational", ok: true },
                { name: "Push Notification Relay", status: "Degraded", ok: false },
                { name: "Database Cluster", status: "Operational", ok: true },
              ].map((s) => (
                <div key={s.name} className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{s.name}</span>
                  <span className={`font-bold text-xs ${s.ok ? "text-green-600" : "text-amber-500"}`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
