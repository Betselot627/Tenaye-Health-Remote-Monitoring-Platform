import { useState } from "react";
import AdminLayout from "./components/AdminLayout";

function Toggle({ checked, onChange, locked = false }) {
  return (
    <button
      onClick={() => !locked && onChange(!checked)}
      disabled={locked}
      title={locked ? "This setting cannot be changed" : undefined}
      className={`relative w-12 h-6 rounded-full transition-colors
        ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${checked ? "bg-[#7B2D8B]" : "bg-gray-200"}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-7" : "translate-x-1"}`}></span>
    </button>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
        <div className="w-10 h-10 bg-[#fdf0f9] rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-[#7B2D8B]">{icon}</span>
        </div>
        <h4 className="font-bold text-gray-800">{title}</h4>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</label>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: "RPHMS",
    tagline: "Remote Patient Health Monitoring System",
    supportEmail: "support@rphms.com",
    language: "en",
    timezone: "Africa/Addis_Ababa",
    jwtExpiry: "1h",
    refreshExpiry: "7d",
    rateLimiting: true,
    twoFactor: false,
    emailNotifs: true,
    inAppNotifs: true,
    criticalAlerts: true,
    appointmentReminders: true,
    reminderTime: "60",
    currency: "ETB",
    maxFileSize: 10,
  });
  const [saveState, setSaveState] = useState("idle"); // "idle" | "saving" | "saved"
  const [dangerModal, setDangerModal] = useState(null); // "clear_notifs" | "reset_platform"
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [toast, setToast] = useState(null);

  const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    }, 800);
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleClearNotifications = () => {
    setDangerModal(null);
    showToast("All notifications cleared.", "success");
  };

  const handleResetPlatform = () => {
    setDangerModal(null);
    setResetConfirmText("");
    showToast("Platform data reset initiated.", "error");
  };

  return (
    <AdminLayout title="Settings">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
          ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          <span className="material-symbols-outlined text-lg">{toast.type === "success" ? "check_circle" : "warning"}</span>
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Clear Notifications Confirmation */}
      {dangerModal === "clear_notifs" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-red-600">notifications_off</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Clear All Notifications</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete all notifications for all users. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDangerModal(null)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleClearNotifications} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Platform Data Confirmation — requires typing "RESET" */}
      {dangerModal === "reset_platform" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-red-600">warning</span>
            </div>
            <h3 className="text-lg font-bold text-red-700 mb-2">Reset Platform Data</h3>
            <p className="text-sm text-gray-500 mb-4">
              This will permanently delete <span className="font-bold text-red-600">all platform data</span> including users, appointments, payments, and medical records. This is completely irreversible.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-red-700 font-semibold">Type <span className="font-black">RESET</span> to confirm</p>
            </div>
            <input
              className="w-full bg-[#fdf0f9] border-2 border-red-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 mb-6 font-mono tracking-widest"
              placeholder="RESET"
              value={resetConfirmText}
              onChange={e => setResetConfirmText(e.target.value.toUpperCase())}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setDangerModal(null); setResetConfirmText(""); }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPlatform}
                disabled={resetConfirmText !== "RESET"}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">System Settings</h2>
          <p className="text-gray-400 mt-1">Platform configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95
            ${saveState === "saved"
              ? "bg-emerald-600 text-white shadow-emerald-200"
              : "bg-[#7B2D8B] text-white shadow-purple-200 hover:bg-purple-800"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          <span className="material-symbols-outlined text-sm">
            {saveState === "saving" ? "hourglass_empty" : saveState === "saved" ? "check_circle" : "save"}
          </span>
          {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* General */}
        <SectionCard title="General Settings" icon="tune">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Platform Name">
              <input className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" value={settings.platformName} onChange={e => update("platformName", e.target.value)} />
            </Field>
            <Field label="Tagline">
              <input className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" value={settings.tagline} onChange={e => update("tagline", e.target.value)} />
            </Field>
            <Field label="Support Email">
              <input className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" value={settings.supportEmail} onChange={e => update("supportEmail", e.target.value)} />
            </Field>
            <Field label="Default Language">
              <select className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none" value={settings.language} onChange={e => update("language", e.target.value)}>
                <option value="en">English</option>
                <option value="am">Amharic</option>
              </select>
            </Field>
            <Field label="Timezone">
              <select className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none" value={settings.timezone} onChange={e => update("timezone", e.target.value)}>
                <option value="Africa/Addis_Ababa">Africa/Addis Ababa (UTC+3)</option>
                <option value="UTC">UTC</option>
              </select>
            </Field>
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security Settings" icon="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="JWT Token Expiry">
              <select className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none" value={settings.jwtExpiry} onChange={e => update("jwtExpiry", e.target.value)}>
                <option value="1h">1 Hour</option>
                <option value="6h">6 Hours</option>
                <option value="24h">24 Hours</option>
              </select>
            </Field>
            <Field label="Refresh Token Validity">
              <select className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none" value={settings.refreshExpiry} onChange={e => update("refreshExpiry", e.target.value)}>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </Field>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-700">Rate Limiting</p>
              <p className="text-xs text-gray-400">100 requests/minute per IP on auth endpoints</p>
            </div>
            <Toggle checked={settings.rateLimiting} onChange={v => update("rateLimiting", v)} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400">Require 2FA for admin accounts</p>
            </div>
            <Toggle checked={settings.twoFactor} onChange={v => update("twoFactor", v)} />
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notification Settings" icon="notifications">
          {[
            { key: "emailNotifs", label: "Email Notifications", desc: "Send email for appointments and alerts" },
            { key: "inAppNotifs", label: "In-App Notifications", desc: "Real-time in-app notification delivery" },
            { key: "criticalAlerts", label: "Critical Vital Alerts", desc: "Always on — cannot be disabled", locked: true },            { key: "appointmentReminders", label: "Appointment Reminders", desc: "Send reminder before scheduled appointments" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  {item.label}
                  {item.locked && (
                    <span className="material-symbols-outlined text-sm text-gray-400" title="Cannot be disabled">lock</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
              <Toggle checked={settings[item.key]} onChange={item.locked ? () => {} : v => update(item.key, v)} locked={item.locked} />
            </div>
          ))}
          <Field label="Reminder Time (minutes before)">
            <input type="number" className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-32" value={settings.reminderTime} onChange={e => update("reminderTime", e.target.value)} />
          </Field>
        </SectionCard>

        {/* Payment */}
        <SectionCard title="Payment Settings" icon="payments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Default Currency">
              <select className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none" value={settings.currency} onChange={e => update("currency", e.target.value)}>
                <option value="ETB">ETB — Ethiopian Birr</option>
                <option value="USD">USD — US Dollar</option>
              </select>
            </Field>
          </div>
          <Field label="Chapa Secret Key">
            <div className="flex gap-2">
              <input type="password" className="flex-1 bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="CHASECK-..." />
              <button className="px-4 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-xl text-sm font-bold hover:bg-purple-100 transition-colors whitespace-nowrap">Test Connection</button>
            </div>
          </Field>
          <Field label="TeleBirr App ID">
            <div className="flex gap-2">
              <input className="flex-1 bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" placeholder="App ID..." />
              <button className="px-4 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-xl text-sm font-bold hover:bg-purple-100 transition-colors whitespace-nowrap">Test Connection</button>
            </div>
          </Field>
          <Field label="Webhook URL">
            <div className="flex gap-2">
              <input readOnly className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm text-gray-400" value="https://api.rphms.com/api/payment/webhook" />
              <button className="px-4 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-xl text-sm font-bold hover:bg-purple-100 transition-colors">
                <span className="material-symbols-outlined text-lg">content_copy</span>
              </button>
            </div>
          </Field>
        </SectionCard>

        {/* Storage */}
        <SectionCard title="Storage & Media" icon="storage">
          <Field label={`Max File Upload Size: ${settings.maxFileSize}MB`}>
            <input type="range" min="1" max="50" value={settings.maxFileSize} onChange={e => update("maxFileSize", Number(e.target.value))} className="w-full accent-[#7B2D8B]" />
          </Field>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Storage Usage</p>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>342 MB used</span>
              <span>1 GB total</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-[#7B2D8B] h-3 rounded-full" style={{ width: "34%" }}></div>
            </div>
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border-2 border-red-200 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-100">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600">warning</span>
            </div>
            <div>
              <h4 className="font-bold text-red-700">Danger Zone</h4>
              <p className="text-xs text-red-400">These actions are irreversible. Proceed with caution.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setDangerModal("clear_notifs")}
              className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-full font-bold text-sm hover:bg-red-50 transition-colors"
            >
              Clear All Notifications
            </button>
            <button
              onClick={() => setDangerModal("reset_platform")}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">warning</span>
              Reset Platform Data
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
