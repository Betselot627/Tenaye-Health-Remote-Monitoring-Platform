import { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import { getNotifications, markAllNotificationsRead, sendBroadcast } from "../../services/adminService";

const typeConfig = {
  vital_alert: { icon: "emergency", color: "bg-red-100 text-red-600", border: "border-red-400" },
  appointment: { icon: "calendar_today", color: "bg-blue-100 text-blue-600", border: "border-blue-400" },
  payment: { icon: "payments", color: "bg-emerald-100 text-emerald-600", border: "border-emerald-400" },
  system: { icon: "settings", color: "bg-gray-100 text-gray-500", border: "border-gray-300" },
  blog: { icon: "article", color: "bg-purple-100 text-purple-600", border: "border-purple-400" },
};

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [showComposer, setShowComposer] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [broadcastData, setBroadcastData] = useState({ title: "", message: "", target: "all" });

  useEffect(() => {
    const load = async () => {
      const { data } = await getNotifications();
      if (data) setNotifications(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  const markAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleSendBroadcast = async () => {
    if (!broadcastData.title || !broadcastData.message) return;
    await sendBroadcast(broadcastData);
    setBroadcastData({ title: "", message: "", target: "all" });
    setShowComposer(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return (
    <AdminLayout title="Notifications">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Notifications">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Notifications</h2>
          <p className="text-gray-400 mt-1">System alerts and broadcast management</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={markAllRead}
            className="px-6 py-3 rounded-full border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Mark All Read
          </button>
          <button
            onClick={() => setShowComposer(!showComposer)}
            className="flex items-center gap-2 px-6 py-3 bg-[#7B2D8B] text-white rounded-full font-bold shadow-lg shadow-purple-200 hover:bg-purple-800 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">campaign</span>
            Send Broadcast
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
          <p className="text-2xl sm:text-3xl font-black text-gray-800">1,284</p>
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Total Sent Today</p>
        </div>
        <div className="bg-red-50 p-4 sm:p-6 rounded-2xl">
          <p className="text-2xl sm:text-3xl font-black text-red-600">{unreadCount}</p>
          <p className="text-[10px] sm:text-xs font-semibold text-red-400 uppercase tracking-wider mt-1">Unread Alerts</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
          <p className="text-2xl sm:text-3xl font-black text-gray-800">342</p>
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Email Notifs</p>
        </div>
      </div>

      {/* Broadcast Composer */}
      {showComposer && (
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-8 border border-[#7B2D8B]/20">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7B2D8B]">campaign</span>
            Broadcast Message
          </h4>
          <div className="space-y-3 sm:space-y-4">
            <input
              className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="Notification title..."
              value={broadcastData.title}
              onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
            />
            <textarea
              className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 h-20 sm:h-24 resize-none"
              placeholder="Message content..."
              value={broadcastData.message}
              onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <select 
                className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none flex-1"
                value={broadcastData.target}
                onChange={(e) => setBroadcastData({ ...broadcastData, target: e.target.value })}
              >
                <option value="all">All Users</option>
                <option value="patients">Patients Only</option>
                <option value="doctors">Doctors Only</option>
              </select>
              <button 
                onClick={handleSendBroadcast}
                disabled={!broadcastData.title || !broadcastData.message}
                className="px-4 sm:px-6 py-3 bg-[#7B2D8B] text-white rounded-full font-bold text-sm hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Send Now
              </button>
              <button className="px-4 sm:px-6 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-full font-bold text-sm hover:bg-purple-100 transition-colors whitespace-nowrap">
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs + List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex gap-2 flex-wrap">
          {["all", "unread", "vital_alert", "appointment", "payment", "system"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                activeTab === tab ? "bg-[#7B2D8B] text-white" : "text-gray-400 hover:bg-[#fdf0f9]"
              }`}
            >
              {tab === "all" ? "All" : tab === "vital_alert" ? "Vital Alerts" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <span className="material-symbols-outlined text-4xl sm:text-5xl text-gray-200 block mb-2 sm:mb-3">notifications_off</span>
              <p className="text-sm sm:text-base text-gray-400 font-medium">No notifications in this category</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const config = typeConfig[notif.type] || typeConfig.system;
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-5 hover:bg-purple-50/20 transition-colors ${!notif.read ? "border-l-4 " + config.border : ""}`}
                >
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    <span className="material-symbols-outlined text-sm sm:text-lg">{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div>
                        <p className={`text-xs sm:text-sm font-bold ${notif.read ? "text-gray-600" : "text-gray-800"}`}>{notif.title}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{notif.message}</p>
                        <p className="text-[10px] sm:text-xs text-gray-300 mt-1">To: {notif.recipient}</p>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <span className="text-[10px] sm:text-xs text-gray-300 whitespace-nowrap">{notif.time}</span>
                        {!notif.read && <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#7B2D8B] rounded-full"></span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                    <button className="p-1.5 sm:p-2 text-[#7B2D8B] hover:bg-purple-50 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-base sm:text-xl">visibility</span>
                    </button>
                    <button className="p-1.5 sm:p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-base sm:text-xl">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#fdf0f9]/30 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Showing {filtered.length} notifications</p>
          <div className="flex gap-0.5 sm:gap-1">
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-xs sm:text-sm">chevron_left</span>
            </button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-[#7B2D8B] text-white font-bold text-xs">1</button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 font-bold text-xs">2</button>
            <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-xs sm:text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
