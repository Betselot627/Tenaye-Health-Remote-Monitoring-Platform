import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getDoctorProfile,
  subscribeDoctorProfile,
} from "../store/doctorProfileStore";

const notificationRoutes = {
  appointment: "/doctor/appointments",
  alert: "/doctor/vitals",
  lab: "/doctor/lab-orders",
  payment: "/doctor/earnings",
};

const navItems = [
  {
    path: "/doctor/appointments",
    label: "Appointments",
    icon: "calendar_today",
  },
  { path: "/doctor/patients", label: "My Patients", icon: "group" },
  { path: "/doctor/prescriptions", label: "Prescriptions", icon: "medication" },
  { path: "/doctor/lab-orders", label: "Lab Orders", icon: "biotech" },
  { path: "/doctor/vitals", label: "Vital Alerts", icon: "monitor_heart" },
  { path: "/doctor/blogs", label: "My Blogs", icon: "article" },
  { path: "/doctor/earnings", label: "Earnings", icon: "payments" },
  { path: "/doctor/schedule", label: "My Schedule", icon: "event_available" },
  { path: "/doctor/settings", label: "Settings", icon: "settings" },
];

const mockNotifications = [
  {
    id: 1,
    title: "New Appointment",
    message: "Bereket Tadesse booked for 10:00 AM",
    time: "5 mins ago",
    type: "appointment",
    unread: true,
  },
  {
    id: 2,
    title: "Critical Vital Alert",
    message: "Patient Sara — SpO2: 88%",
    time: "12 mins ago",
    type: "alert",
    unread: true,
  },
  {
    id: 3,
    title: "Lab Result Ready",
    message: "CBC results for Yonas Bekele are ready",
    time: "1 hour ago",
    type: "lab",
    unread: false,
  },
  {
    id: 4,
    title: "Payment Received",
    message: "600 ETB consultation fee received",
    time: "2 hours ago",
    type: "payment",
    unread: false,
  },
];

function DoctorProfileModal({ doc, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined text-white text-lg">
              close
            </span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-black">
              {doc.name.split(" ")[1]?.[0] ?? "D"}
            </div>
            <div>
              <h3 className="text-xl font-black">{doc.name}</h3>
              <p className="text-sm opacity-80">{doc.specialty}</p>
              <p className="text-xs opacity-60 mt-0.5">{doc.subSpecialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-yellow-300 text-base">
                star
              </span>
              <span className="text-sm font-bold">{doc.rating}</span>
              <span className="text-xs opacity-70">
                ({doc.totalReviews} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-white/70 text-base">
                group
              </span>
              <span className="text-sm font-bold">
                {doc.totalPatients} patients
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {[
            { label: "Email", value: doc.email, icon: "mail" },
            { label: "Phone", value: doc.phone, icon: "phone" },
            { label: "Hospital", value: doc.hospital, icon: "local_hospital" },
            {
              label: "Experience",
              value: doc.experience,
              icon: "workspace_premium",
            },
            { label: "Education", value: doc.education, icon: "school" },
            {
              label: "Languages",
              value: doc.languages.join(", "),
              icon: "translate",
            },
            {
              label: "Consultation Fee",
              value: doc.consultationFee,
              icon: "payments",
            },
            {
              label: "Availability",
              value: doc.availability,
              icon: "schedule",
            },
            { label: "License No.", value: doc.licenseNo, icon: "badge" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0"
            >
              <span className="material-symbols-outlined text-[#7B2D8B] text-lg mt-0.5 shrink-0">
                {icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {value}
                </p>
              </div>
            </div>
          ))}

          {/* Bio */}
          <div className="bg-[#fdf0f9] rounded-2xl p-4 mt-2">
            <p className="text-xs font-bold text-[#7B2D8B] uppercase tracking-wider mb-2">
              About
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{doc.bio}</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#7B2D8B] text-white rounded-xl font-bold text-sm hover:bg-[#6a2578] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DoctorLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(getDoctorProfile());

  useEffect(() => {
    const unsub = subscribeDoctorProfile((updated) =>
      setDoctorProfile(updated),
    );
    return unsub;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSidebarOpen(false);
      setShowNotifications(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctor/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fff7fa]">
      {showDoctorProfile && (
        <DoctorProfileModal
          doc={doctorProfile}
          onClose={() => setShowDoctorProfile(false)}
        />
      )}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-lg z-50 flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-[#7B2D8B] rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">
              stethoscope
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#7B2D8B]">RPHMS</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Doctor Portal
            </p>
          </div>
          <button
            className="lg:hidden p-1 rounded-lg hover:bg-purple-50 text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl mx-2 transition-all duration-200 ${isActive ? "bg-[#7B2D8B] text-white shadow-lg shadow-purple-200" : "text-gray-500 hover:bg-purple-50 hover:translate-x-1"}`}
              >
                <span className="material-symbols-outlined text-xl">
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Doctor profile card */}
        <button
          onClick={() => setShowDoctorProfile(true)}
          className="shrink-0 mx-4 mb-6 p-4 bg-[#fdf0f9] rounded-2xl flex items-center gap-3 hover:bg-purple-100 transition-colors text-left w-[calc(100%-2rem)]"
        >
          <div className="w-10 h-10 rounded-full bg-[#7B2D8B] flex items-center justify-center text-white font-bold text-sm shrink-0">
            A
          </div>
          <div className="overflow-hidden flex-1">
            <p className="font-bold text-sm text-gray-800 truncate">
              {doctorProfile.name}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold truncate">
              {doctorProfile.specialty}
            </p>
          </div>
          <span className="material-symbols-outlined text-gray-400 text-base shrink-0">
            open_in_new
          </span>
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-72 w-full">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-sm flex items-center h-16 px-4 md:px-8 gap-4">
          <button
            className="p-2 rounded-xl hover:bg-purple-50 text-gray-600 transition-colors lg:hidden flex-shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <h2 className="text-base md:text-lg font-bold text-[#7B2D8B] flex-1 truncate">
            {title}
          </h2>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                search
              </span>
              <input
                className="pl-10 pr-4 py-2 bg-[#fdf0f9] border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-48 lg:w-56"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-purple-50 transition-colors"
              >
                <span className="material-symbols-outlined text-gray-500">
                  notifications
                </span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Notifications
                        </h3>
                        <p className="text-xs text-gray-400">
                          {unreadCount} unread
                        </p>
                      </div>
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#7B2D8B] font-semibold hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            setShowNotifications(false);
                            navigate(notificationRoutes[n.type] ?? "/doctor");
                          }}
                          className={`p-4 border-b border-gray-50 hover:bg-purple-50/50 cursor-pointer transition-colors ${n.unread ? "bg-purple-50/30" : ""}`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === "alert" ? "bg-red-100" : n.type === "appointment" ? "bg-purple-100" : n.type === "payment" ? "bg-emerald-100" : "bg-blue-100"}`}
                            >
                              <span
                                className={`material-symbols-outlined text-sm ${n.type === "alert" ? "text-red-600" : n.type === "appointment" ? "text-purple-600" : n.type === "payment" ? "text-emerald-600" : "text-blue-600"}`}
                              >
                                {n.type === "alert"
                                  ? "emergency"
                                  : n.type === "appointment"
                                    ? "calendar_today"
                                    : n.type === "payment"
                                      ? "payments"
                                      : "biotech"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate">
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {n.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {n.time}
                              </p>
                            </div>
                            {n.unread && (
                              <span className="w-2 h-2 bg-[#7B2D8B] rounded-full flex-shrink-0 mt-2"></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate("/doctor/notifications");
                        }}
                        className="w-full py-2 text-sm font-semibold text-[#7B2D8B] hover:bg-purple-50 rounded-xl transition-colors"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
