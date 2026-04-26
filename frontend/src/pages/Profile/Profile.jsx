import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PatientLayout from "../../components/layout/PatientLayout";

const mockUser = {
  full_name: "Bereket Tadesse",
  email: "bereket@example.com",
  phone: "+251 91 111 2233",
  gender: "Male",
  age: 28,
  bloodType: "O+",
  allergies: "Penicillin",
  role: "patient",
};

const quickLinks = [
  { label: "My Appointments", icon: "calendar_today", path: "/appointments" },
  { label: "Medical Records", icon: "medical_information", path: "/medical" },
  { label: "Billing", icon: "payments", path: "/billing" },
  { label: "Find Doctors", icon: "stethoscope", path: "/doctors" },
  { label: "Health Blog", icon: "article", path: "/blogs" },
  { label: "Settings", icon: "settings", path: "/settings" },
];

export default function Profile() {
  const navigate = useNavigate();
  const [user] = useState(mockUser);

  const initials = user.full_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        {/* Profile header */}
        <div className="bg-gradient-to-br from-[#632a7e] to-[#8b3fb0] rounded-3xl p-8 text-white mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-black">{user.full_name}</h1>
            <p className="text-purple-200 text-sm mt-1">{user.email}</p>
            <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                {user.role}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                {user.gender} · {user.age} yrs
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                Blood: {user.bloodType}
              </span>
            </div>
          </div>
          <Link
            to="/settings"
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Edit
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-4">
              Personal Information
            </h2>
            <div className="space-y-3">
              {[
                { label: "Full Name", value: user.full_name, icon: "person" },
                { label: "Email", value: user.email, icon: "mail" },
                { label: "Phone", value: user.phone, icon: "phone" },
                { label: "Gender", value: user.gender, icon: "wc" },
                { label: "Age", value: `${user.age} years`, icon: "cake" },
                {
                  label: "Blood Type",
                  value: user.bloodType,
                  icon: "bloodtype",
                },
                {
                  label: "Allergies",
                  value: user.allergies || "None",
                  icon: "warning",
                },
              ].map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="material-symbols-outlined text-[#632a7e] text-base shrink-0">
                    {icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickLinks.map(({ label, icon, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-purple-50 hover:text-[#632a7e] transition-colors group"
                  >
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#632a7e] text-2xl transition-colors">
                      {icon}
                    </span>
                    <span className="text-xs font-semibold text-gray-600 group-hover:text-[#632a7e] text-center transition-colors">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors"
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
