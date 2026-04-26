import { Link } from "react-router-dom";
import PatientLayout from "../../components/layout/PatientLayout";

const quickActions = [
  {
    label: "Find a Doctor",
    icon: "stethoscope",
    path: "/doctors",
    color: "bg-purple-100 text-[#632a7e]",
  },
  {
    label: "My Appointments",
    icon: "calendar_today",
    path: "/appointments",
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Medical Records",
    icon: "medical_information",
    path: "/medical",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Health Blog",
    icon: "article",
    path: "/blogs",
    color: "bg-amber-100 text-amber-700",
  },
  {
    label: "Billing",
    icon: "payments",
    path: "/billing",
    color: "bg-pink-100 text-pink-700",
  },
  {
    label: "Settings",
    icon: "settings",
    path: "/settings",
    color: "bg-gray-100 text-gray-600",
  },
];

export default function Dashboard() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const firstName = user?.full_name?.split(" ")[0] ?? "there";

  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-800">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-gray-400 mt-1">What would you like to do today?</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {quickActions.map(({ label, icon, path, color }) => (
            <Link
              key={path}
              to={path}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {icon}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#632a7e] transition-colors text-center">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
}
