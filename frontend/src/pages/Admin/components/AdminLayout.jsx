import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: "grid_view" },
  { path: "/admin/users", label: "Users", icon: "group" },
  { path: "/admin/doctors", label: "Doctors", icon: "medical_services" },
  { path: "/admin/appointments", label: "Appointments", icon: "calendar_today" },
  { path: "/admin/medical-records", label: "Medical Records", icon: "folder_shared" },
  { path: "/admin/blogs", label: "Blog Management", icon: "article" },
  { path: "/admin/payments", label: "Payments", icon: "payments" },
  { path: "/admin/notifications", label: "Notifications", icon: "notifications" },
  { path: "/admin/settings", label: "Settings", icon: "settings" },
];

export default function AdminLayout({ children, title }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#fff7fa]">

      {/* ── Overlay (mobile only) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-white shadow-lg z-50
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo + close button (close only visible on mobile) */}
        <div className="px-6 py-6 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-[#7B2D8B] rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">favorite</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#7B2D8B]">RPHMS</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Admin Console</p>
          </div>
          {/* Close button — mobile only */}
          <button
            className="lg:hidden p-1 rounded-lg hover:bg-purple-50 text-gray-500 transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl mx-2 transition-all duration-200
                  ${isActive
                    ? "bg-[#7B2D8B] text-white shadow-lg shadow-purple-200"
                    : "text-gray-500 hover:bg-purple-50 hover:translate-x-1"
                  }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile — always visible at bottom */}
        <div className="flex-shrink-0 mx-4 mb-6 p-4 bg-[#fdf0f9] rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7B2D8B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            A
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-gray-800 truncate">Admin User</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">System Administrator</p>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-72 w-full">

        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-sm flex items-center h-16 px-4 md:px-8 gap-4">

          {/* Burger button */}
          <button
            className="p-2 rounded-xl hover:bg-purple-50 text-gray-600 transition-colors lg:hidden flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <h2 className="text-base md:text-lg font-bold text-[#7B2D8B] flex-1 truncate">{title}</h2>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Search — hidden on small screens */}
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
              <input
                className="pl-10 pr-4 py-2 bg-[#fdf0f9] border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-48 lg:w-56"
                placeholder="Search..."
                type="text"
              />
            </div>

            {/* Notification bell */}
            <button className="relative p-2 rounded-full hover:bg-purple-50 transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-gray-500">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
