import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "./components/DoctorLayout";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "./store/doctorProfileStore";

function Toast({ message, type = "success", onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-100 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
      ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined text-lg">
        {type === "success" ? "check_circle" : "cancel"}
      </span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

export default function DoctorSettings() {
  const navigate = useNavigate();
  const stored = getDoctorProfile();

  const [profile, setProfile] = useState({
    name: stored.name,
    email: stored.email,
    phone: stored.phone,
    specialty: stored.specialty,
    subSpecialty: stored.subSpecialty,
    hospital: stored.hospital,
    experience: stored.experience,
    education: stored.education,
    consultationFee: stored.consultationFee.replace(" ETB", ""),
    availability: stored.availability,
    licenseNo: stored.licenseNo,
    bio: stored.bio,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    appointments: true,
    vitals: true,
    payments: false,
    messages: true,
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateDoctorProfile({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      specialty: profile.specialty,
      subSpecialty: profile.subSpecialty,
      hospital: profile.hospital,
      experience: profile.experience,
      education: profile.education,
      consultationFee: `${profile.consultationFee} ETB`,
      availability: profile.availability,
      licenseNo: profile.licenseNo,
      bio: profile.bio,
    });
    showToast("Profile updated successfully");
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passwords.current) {
      showToast("Enter your current password", "error");
      return;
    }
    if (passwords.newPass.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      showToast("Passwords do not match", "error");
      return;
    }
    setPasswords({ current: "", newPass: "", confirm: "" });
    showToast("Password changed successfully");
  };

  const notificationRoutes = {
    appointments: "/doctor/appointments",
    vitals: "/doctor/vitals",
    payments: "/doctor/earnings",
    messages: "/doctor/appointments",
  };

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DoctorLayout title="Settings">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-6 max-w-2xl">
        {/* Live preview card */}
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] rounded-2xl p-5 text-white flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-black shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black truncate">{profile.name || "—"}</p>
            <p className="text-sm opacity-80 truncate">
              {profile.specialty || "—"}
              {profile.subSpecialty ? ` · ${profile.subSpecialty}` : ""}
            </p>
            <p className="text-xs opacity-60 mt-0.5 truncate">
              {profile.hospital || "—"}
            </p>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-5">
            Profile Information
          </h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "name", label: "Full Name" },
                { key: "email", label: "Email", type: "email" },
                { key: "phone", label: "Phone" },
                { key: "specialty", label: "Specialty" },
                { key: "subSpecialty", label: "Sub-Specialty" },
                { key: "hospital", label: "Hospital" },
                { key: "experience", label: "Experience" },
                { key: "education", label: "Education" },
                { key: "consultationFee", label: "Consultation Fee (ETB)" },
                { key: "availability", label: "Availability" },
                { key: "licenseNo", label: "License No." },
              ].map(({ key, label, type = "text" }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={profile[key]}
                    onChange={(e) =>
                      setProfile({ ...profile, [key]: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8B]/20"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Bio
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8B]/20 resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#7B2D8B] text-white rounded-xl font-bold text-sm hover:bg-[#6a2578] transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Password */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-5">
            Change Password
          </h2>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            {[
              { key: "current", label: "Current Password" },
              { key: "newPass", label: "New Password" },
              { key: "confirm", label: "Confirm New Password" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  {label}
                </label>
                <input
                  type="password"
                  value={passwords[key]}
                  onChange={(e) =>
                    setPasswords({ ...passwords, [key]: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8B]/20"
                />
              </div>
            ))}
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#7B2D8B] text-white rounded-xl font-bold text-sm hover:bg-[#6a2578] transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-1">
            Notification Preferences
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            Click a row to navigate to that section
          </p>
          <div className="space-y-1">
            {[
              {
                key: "appointments",
                label: "New Appointments",
                desc: "Get notified when a patient books",
                icon: "calendar_today",
              },
              {
                key: "vitals",
                label: "Vital Alerts",
                desc: "Critical patient vital notifications",
                icon: "monitor_heart",
              },
              {
                key: "payments",
                label: "Payment Received",
                desc: "Notify on successful payments",
                icon: "payments",
              },
              {
                key: "messages",
                label: "New Messages",
                desc: "Chat and consultation messages",
                icon: "chat",
              },
            ].map(({ key, label, desc, icon }) => (
              <div
                key={key}
                className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => navigate(notificationRoutes[key])}
              >
                <div className="w-9 h-9 rounded-xl bg-[#fdf0f9] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#7B2D8B] text-lg">
                    {icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-[#7B2D8B] transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotifications((prev) => ({
                      ...prev,
                      [key]: !prev[key],
                    }));
                  }}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                    notifications[key] ? "bg-[#7B2D8B]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      notifications[key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="material-symbols-outlined text-gray-300 text-base group-hover:text-[#7B2D8B] transition-colors">
                  chevron_right
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
