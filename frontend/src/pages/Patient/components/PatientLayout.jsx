import { useState } from "react";
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

const nIcon = {
  appointment: "calendar_today",
  lab: "biotech",
  prescription: "medication",
  payment: "payments",
};
const nColor = {
  appointment: "bg-rose-100 text-rose-600",
  lab: "bg-emerald-100 text-emerald-600",
  prescription: "bg-amber-100 text-amber-600",
  payment: "bg-pink-100 text-pink-600",
};
const nRoute = {
  appointment: "/patient/appointments",
  lab: "/patient/lab-results",
  prescription: "/patient/prescriptions",
  payment: "/patient/billing",
};

export default function PatientLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(mockPatientNotifications);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const markRead = (id) =>
    setNotifs((p) => p.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const markAll = () =>
    setNotifs((p) => p.map((n) => ({ ...n, unread: false })));
  const unread = notifs.filter((n) => n.unread).length;
  const isActive = (path) =>
    path === "/patient"
      ? location.pathname === "/patient"
      : location.pathname.startsWith(path);

  // Close sidebar/notifs on route change without setState-in-effect
  const handleNavClick = () => {
    setSidebarOpen(false);
    setShowNotifs(false);
  };

  return (
    <div className="flex min-h-screen bg-[#fff5f7]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — white with rose accents */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white z-50 flex flex-col transition-transform duration-300 border-r border-rose-100 shadow-lg ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-rose-100">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg,#E05C8A,#F4845F)" }}
          >
            <span
              className="material-symbols-outlined text-white text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </div>
          <div>
            <h1
              className="text-lg font-black leading-none"
              style={{ color: "#E05C8A" }}
            >
              RPHMS
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Patient Portal
            </p>
          </div>
          <button
            className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-rose-50"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-gray-500 text-xl">
              close
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                ${isActive(path) ? "text-white shadow-lg" : "text-gray-500 hover:bg-rose-50 hover:text-[#E05C8A]"}`}
              style={
                isActive(path)
                  ? { background: "linear-gradient(135deg,#E05C8A,#F4845F)" }
                  : {}
              }
            >
              <span
                className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${isActive(path) ? "text-white" : "text-gray-400 group-hover:text-[#E05C8A]"}`}
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
        <div className="p-4 border-t border-rose-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-100">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md shrink-0"
              style={{ background: "linear-gradient(135deg,#E05C8A,#F4845F)" }}
            >
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
              className="p-1.5 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-400 text-lg">
                settings
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:ml-72 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
          <div className="flex items-center gap-4 px-4 md:px-6 h-16">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-rose-50 transition-colors"
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
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2.5 rounded-xl hover:bg-rose-50 transition-colors group"
              >
                <span className="material-symbols-outlined text-gray-500 group-hover:text-[#E05C8A] transition-colors">
                  notifications
                </span>
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {unread}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-rose-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-rose-100 bg-rose-50">
                    <h4 className="font-bold text-gray-800 text-sm">
                      Notifications
                    </h4>
                    {unread > 0 && (
                      <button
                        onClick={markAll}
                        className="text-xs font-bold hover:underline"
                        style={{ color: "#E05C8A" }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifs.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          markRead(n.id);
                          navigate(nRoute[n.type] || "/patient");
                          setShowNotifs(false);
                        }}
                        className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-rose-50/50 transition-colors text-left ${n.unread ? "bg-rose-50/30" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${nColor[n.type] || "bg-gray-100 text-gray-500"}`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {nIcon[n.type] || "notifications"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-bold ${n.unread ? "text-[#E05C8A]" : "text-gray-800"}`}
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
                          <span className="w-2 h-2 rounded-full bg-[#E05C8A] shrink-0 mt-1.5 animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/patient/settings")}
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              style={{ background: "linear-gradient(135deg,#E05C8A,#F4845F)" }}
            >
              <span className="material-symbols-outlined text-white text-lg">
                person
              </span>
            </button>
            <button
              onClick={handleLogout}
              title="Logout"
              className="ml-3 px-3 py-2 rounded-lg bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
