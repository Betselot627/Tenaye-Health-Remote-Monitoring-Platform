import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { path: "/dashboard", label: "Dashboard", icon: "grid_view" },
  { path: "/doctors", label: "Doctors", icon: "stethoscope" },
  { path: "/appointments", label: "Appointments", icon: "calendar_today" },
  { path: "/medical", label: "Medical", icon: "medical_information" },
  { path: "/blogs", label: "Blogs", icon: "article" },
  { path: "/billing", label: "Billing", icon: "payments" },
];

export default function PatientLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "P";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fdf7f9] font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-sm border-b border-purple-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#632a7e] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-base">
                stethoscope
              </span>
            </div>
            <span className="text-[#632a7e] font-bold text-lg hidden sm:block">
              RPHMS
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => {
              const active = location.pathname.startsWith(l.path);
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#632a7e] text-white"
                      : "text-gray-500 hover:bg-purple-50 hover:text-[#632a7e]"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {l.icon}
                  </span>
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Right — profile + logout */}
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-purple-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#632a7e] flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                {user?.full_name?.split(" ")[0] ?? "Profile"}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-purple-50 text-gray-600"
            >
              <span className="material-symbols-outlined">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-purple-50 bg-white px-4 py-3 space-y-1">
            {navLinks.map((l) => {
              const active = location.pathname.startsWith(l.path);
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#632a7e] text-white"
                      : "text-gray-600 hover:bg-purple-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {l.icon}
                  </span>
                  {l.label}
                </Link>
              );
            })}
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-purple-50"
            >
              <span className="material-symbols-outlined text-base">
                person
              </span>
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              Sign Out
            </button>
          </div>
        )}
      </nav>

      <main>{children}</main>

      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#632a7e] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">
                stethoscope
              </span>
            </div>
            <span className="text-[#632a7e] font-bold text-sm">RPHMS</span>
          </div>
          <p className="text-xs text-gray-400">
            © 2025 RPHMS — Remote Patient Health Monitoring System
          </p>
        </div>
      </footer>
    </div>
  );
}
