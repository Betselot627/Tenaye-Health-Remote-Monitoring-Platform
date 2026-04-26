import { Link, useLocation} from "react-router-dom";

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

  return (
    <div className="flex min-h-screen bg-[#fff7fa]">
      {/* Sidebar */}
      <aside className="w-72 fixed h-screen bg-white shadow-lg flex flex-col py-8 px-4 z-50">
        {/* Logo */}
        <div className="px-4 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7B2D8B] rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">favorite</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#7B2D8B]">RPHMS</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Admin Console</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
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

        {/* Admin Profile */}
        <div className="mx-2 p-4 bg-[#fdf0f9] rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7B2D8B] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-gray-800 truncate">Admin User</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">System Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-sm flex justify-between items-center h-16 px-8">
          <h2 className="text-lg font-bold text-[#7B2D8B]">{title}</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
              <input
                className="pl-10 pr-4 py-2 bg-[#fdf0f9] border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-56"
                placeholder="Search..."
                type="text"
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-purple-50 transition-colors">
              <span className="material-symbols-outlined text-gray-500">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
