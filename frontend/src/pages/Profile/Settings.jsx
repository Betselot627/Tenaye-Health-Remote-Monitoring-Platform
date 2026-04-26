import { useState } from "react";
import { Link } from "react-router-dom";
import PatientLayout from "../../components/layout/PatientLayout";

function Toast({ message, type = "success", onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-100 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
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

export default function Settings() {
  const [profile, setProfile] = useState({
    full_name: "Bereket Tadesse",
    email: "bereket@example.com",
    phone: "+251 91 111 2233",
    gender: "Male",
    age: "28",
    bloodType: "O+",
    allergies: "Penicillin",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [notifications, setNotifications] = useState({
    appointments: true,
    vitals: true,
    blogs: false,
    billing: true,
  });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    showToast("Profile updated successfully");
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passwords.current) {
      showToast("Enter your current password", "error");
      return;
    }
    if (passwords.newPass.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      showToast("Passwords do not match", "error");
      return;
    }
    setPasswords({ current: "", newPass: "", confirm: "" });
    showToast("Password changed successfully");
  };

  return (
    <PatientLayout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-2xl mx-auto px-6 md:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/profile"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-500">
              arrow_back
            </span>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-800">Settings</h1>
            <p className="text-gray-400 text-sm">
              Manage your account preferences
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5">
              Profile Information
            </h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "full_name", label: "Full Name" },
                  { key: "email", label: "Email", type: "email" },
                  { key: "phone", label: "Phone" },
                  { key: "age", label: "Age", type: "number" },
                  { key: "bloodType", label: "Blood Type" },
                  { key: "allergies", label: "Allergies" },
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
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#632a7e]/20"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    Gender
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) =>
                      setProfile({ ...profile, gender: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#632a7e]/20 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#632a7e] text-white rounded-xl font-bold text-sm hover:bg-purple-900 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5">Change Password</h2>
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#632a7e]/20"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#632a7e] text-white rounded-xl font-bold text-sm hover:bg-purple-900 transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-800 mb-5">
              Notification Preferences
            </h2>
            <div className="space-y-1">
              {[
                {
                  key: "appointments",
                  label: "Appointment Reminders",
                  desc: "Get notified before your consultations",
                },
                {
                  key: "vitals",
                  label: "Vital Alerts",
                  desc: "Alerts when your tracked vitals are abnormal",
                },
                {
                  key: "blogs",
                  label: "New Blog Posts",
                  desc: "Weekly health articles from our doctors",
                },
                {
                  key: "billing",
                  label: "Payment Updates",
                  desc: "Receipts and billing notifications",
                },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {label}
                    </p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${notifications[key] ? "bg-[#632a7e]" : "bg-gray-200"}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[key] ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
