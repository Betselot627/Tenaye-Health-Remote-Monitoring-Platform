import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { mockPatientNotifications } from "../data/mockData";

const navItems = [
  { path: "/patient", label: "Dashboard", icon: "grid_view" },
  {
    path: "/patient/appointments",
    label: "Appointments",
    icon: "calendar_today",
  },
  { path: "/patient/doctors", label: "Find Doctors", icon: "medical_services" },
  {
    path: "/patient/prescriptions",
    label: "Prescriptions",
    icon: "medication",
  },
  { path: "/patient/lab-results", label: "Lab Results", icon: "biotech" },
  { path: "/patient/vitals", label: "My Vitals", icon: "monitor_heart" },
  { path: "/patient/billing", label: "Billing", icon: "payments" },
  { path: "/patient/blogs", label: "Health Blogs", icon: "article" },
  { path: "/patient/settings", label: "Settings", icon: "settings" },
];

export default function PatientLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockPatientNotifications);

  useEffect(() => {
    setSidebarOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const unreadCount = notifications.filter((n) => n.unread).length;

  const notifIcon = {
    appointment: "calendar_today",
    lab: "biotech",
    prescription: "medication",
    payment: "payments",
  };
  const notifColor = {
    appointment: "bg-blue-100 text-blue-600",
    lab: "bg-emerald-100 text-emerald-600",
    prescription: "bg-amber-100 text-amber-600",
    payment: "bg-purple-100 text-purple-600",
  };
  const notifRoute = {
    appointment: "/patient/appointments",
    lab: "/patient/lab-results",
    prescription: "/patient/prescriptions",
    payment: "/patient/billing",
  };

  const isActive = (path) =>
    path === "/patient"
      ? location.pathname === "/patient"
      : location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen bg-[#fff7fa]">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-lg z-50 flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-xl">
              favorite
            </span>
          </div>
          <div>
            <h1 className="text-lg font-black text-[#7B2D8B] leading-none">
              RPHMS
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Patient Portal
            </p>
          </div>
          <button
            className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-gray-500 text-xl">
              close
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                ${
                  isActive(path)
                    ? "bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white shadow-lg shadow-purple-200"
                    : "text-gray-500 hover:bg-[#fdf0f9] hover:text-[#7B2D8B]"
                }`}
            >
              <span
                className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${isActive(path) ? "text-white" : "text-gray-400 group-hover:text-[#7B2D8B]"}`}
              >
                {icon}
              </span>
              {label}
              {isActive(path) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        {/* Profile card */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#fdf0f9] to-purple-50 border border-purple-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-lg">
                person
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">
                Bereket Tadesse
              </p>
              <p className="text-xs text-gray-400">Patient</p>
            </div>
            <button
              onClick={() => navigate("/patient/settings")}
              className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-400 text-lg">
                settings
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col lg:ml-72 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 px-4 md:px-6 h-16">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined text-gray-600">
                menu
              </span>
            </button>

            <div className="flex-1">
              <h2 className="text-base font-black text-gray-800">{title}</h2>
              <p className="text-xs text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl hover:bg-[#fdf0f9] transition-colors group"
              >
                <span className="material-symbols-outlined text-gray-500 group-hover:text-[#7B2D8B] transition-colors">
                  notifications
                </span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#fdf0f9] to-white">
                    <h4 className="font-bold text-gray-800 text-sm">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#7B2D8B] font-bold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          navigate(notifRoute[n.type] || "/patient");
                          setShowNotifications(false);
                        }}
                        className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-[#fdf0f9] transition-colors text-left ${n.unread ? "bg-purple-50/40" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${notifColor[n.type] || "bg-gray-100 text-gray-500"}`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {notifIcon[n.type] || "notifications"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold text-gray-800 ${n.unread ? "text-[#7B2D8B]" : ""}`}
                          >
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {n.time}
                          </p>
                        </div>
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#7B2D8B] flex-shrink-0 mt-1.5 animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <button
              onClick={() => navigate("/patient/settings")}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined text-white text-lg">
                person
              </span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
