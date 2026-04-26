import { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import { getSettings, saveSettings } from "../../services/adminService";

function Toggle({ checked, onChange, locked = false }) {
  return (
    <button
      onClick={() => !locked && onChange(!checked)}
      disabled={locked}
      title={locked ? "This setting cannot be changed" : undefined}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner
        ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"}
        ${checked ? "bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] shadow-purple-300" : "bg-gray-300"}`}
    >
      <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${checked ? "translate-x-7" : "translate-x-0.5"}`}>
        {checked && <span className="absolute inset-0 flex items-center justify-center text-[#7B2D8B] text-xs">✓</span>}
      </span>
    </button>
  );
}

function SectionCard({ title, icon, children, purple = false }) {
  return (
    <div className={`rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-lg ${purple ? "bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] text-white" : "bg-white"}`}>
      <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${purple ? "border-white/20" : "border-gray-50"}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-110 ${purple ? "bg-white/20" : "bg-[#fdf0f9]"}`}>
          <span className={`material-symbols-outlined ${purple ? "text-white" : "text-[#7B2D8B]"}`}>{icon}</span>
        </div>
        <h4 className={`font-bold ${purple ? "text-white" : "text-gray-800"}`}>{title}</h4>
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
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle"); // "idle" | "saving" | "saved"
  const [dangerModal, setDangerModal] = useState(null); // "clear_notifs" | "reset_platform"
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [toast, setToast] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [fileTypes, setFileTypes] = useState(["PDF", "JPG", "PNG", "DICOM"]);
  const [newFileType, setNewFileType] = useState("");
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ chapa: null, telebirr: null });
  const [systemStats] = useState({ logCount: 1247, configCount: 89 });

  useEffect(() => {
    const load = async () => {
      const { data } = await getSettings();
      if (data) setSettings(data);
      setLoading(false);
    };
    load();
  }, []);

  const update = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      showToast("No changes to save", "info");
      return;
    }
    
    setSaveState("saving");
    const { error } = await saveSettings(settings);
    
    if (error) {
      setSaveState("idle");
      showToast("Failed to save settings", "error");
    } else {
      setSaveState("saved");
      setHasChanges(false);
      showToast("Settings saved successfully!", "success");
      setTimeout(() => setSaveState("idle"), 2500);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleClearNotifications = () => {
    setDangerModal(null);
    // In production, call API to clear notifications
    showToast("All system logs cleared successfully.", "success");
  };

  const handleResetPlatform = () => {
    setDangerModal(null);
    setResetConfirmText("");
    // In production, call API to reset platform
    showToast("Platform configuration reset initiated.", "error");
  };

  const handleTestConnection = (gateway) => {
    const key = gateway.toLowerCase();
    setConnectionStatus(prev => ({ ...prev, [key]: "testing" }));
    showToast(`Testing ${gateway} connection...`, "info");
    
    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      setConnectionStatus(prev => ({ ...prev, [key]: success ? "success" : "failed" }));
      showToast(
        success ? `${gateway} connection successful!` : `${gateway} connection failed!`,
        success ? "success" : "error"
      );
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setConnectionStatus(prev => ({ ...prev, [key]: null }));
      }, 5000);
    }, 1500);
  };

  const removeFileType = (type) => {
    setFileTypes(prev => prev.filter(t => t !== type));
    setHasChanges(true);
    showToast(`${type} removed from allowed types`, "success");
  };

  const addFileType = () => {
    if (!newFileType.trim()) return;
    const upperType = newFileType.toUpperCase().trim();
    if (fileTypes.includes(upperType)) {
      showToast("File type already exists", "error");
      return;
    }
    setFileTypes(prev => [...prev, upperType]);
    setNewFileType("");
    setHasChanges(true);
    showToast(`${upperType} added to allowed types`, "success");
  };

  const changeCurrency = (newCurrency) => {
    update("currency", newCurrency);
    setShowCurrencyModal(false);
    showToast(`Currency changed to ${newCurrency}`, "success");
  };

  if (loading || !settings) return (
    <AdminLayout title="Settings">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Settings">
      {/* Currency Change Modal */}
      {showCurrencyModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowCurrencyModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[70]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7B2D8B]">payments</span>
                Change System Currency
              </h3>
              
              <div className="space-y-3 mb-6">
                {[
                  { code: "ETB", name: "Ethiopian Birr", symbol: "ETB" },
                  { code: "USD", name: "US Dollar", symbol: "$" },
                  { code: "EUR", name: "Euro", symbol: "€" },
                  { code: "GBP", name: "British Pound", symbol: "£" },
                ].map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => changeCurrency(currency.code)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                      settings.currency === currency.code
                        ? "border-[#7B2D8B] bg-[#fdf0f9]"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {currency.symbol}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-800">{currency.name}</p>
                        <p className="text-xs text-gray-500">{currency.code}</p>
                      </div>
                    </div>
                    {settings.currency === currency.code && (
                      <span className="material-symbols-outlined text-[#7B2D8B]">check_circle</span>
                    )}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowCurrencyModal(false)}
                className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold animate-slide-in-right
          ${toast.type === "success" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : 
            toast.type === "error" ? "bg-gradient-to-r from-red-500 to-red-600" : 
            "bg-gradient-to-r from-blue-500 to-blue-600"}`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === "success" ? "check_circle" : toast.type === "error" ? "error" : "info"}
          </span>
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
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
          <h2 className="text-3xl font-black text-[#7B2D8B] flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl">settings</span>
            System Settings
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Configure platform behavior, security, and integrations</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveState === "saving" || !hasChanges}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 hover:scale-105
            ${saveState === "saved"
              ? "bg-emerald-600 text-white shadow-emerald-200 animate-pulse"
              : hasChanges 
                ? "bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white shadow-purple-300 hover:shadow-purple-400"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          <span className={`material-symbols-outlined text-sm ${saveState === "saving" ? "animate-spin" : ""}`}>
            {saveState === "saving" ? "sync" : saveState === "saved" ? "check_circle" : "save"}
          </span>
          {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved Successfully!" : hasChanges ? "Save Changes" : "No Changes"}
        </button>
      </div>

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* General */}
          <SectionCard title="General" icon="tune">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Platform Name">
                <input className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" value={settings.platformName} onChange={e => update("platformName", e.target.value)} />
              </Field>
              <Field label="System Email">
                <input className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" value={settings.supportEmail} onChange={e => update("supportEmail", e.target.value)} />
              </Field>
              <Field label="Default Language">
                <select className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none" value={settings.language} onChange={e => update("language", e.target.value)}>
                  <option value="en">English (US)</option>
                  <option value="am">Amharic</option>
                </select>
              </Field>
              <Field label="Timezone">
                <select className="bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none" value={settings.timezone} onChange={e => update("timezone", e.target.value)}>
                  <option value="Africa/Addis_Ababa">East Africa Time (UTC+3)</option>
                  <option value="UTC">UTC</option>
                </select>
              </Field>
            </div>
          </SectionCard>

          {/* Payment Gateways */}
          <SectionCard title="Payment Gateways" icon="payments">
            <div className="bg-gradient-to-r from-[#fdf0f9] to-purple-50 rounded-xl p-4 mb-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg">
                    {settings.currency === "ETB" ? "ETB" : settings.currency === "USD" ? "$" : settings.currency}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">System Currency</p>
                    <p className="text-xs text-gray-500">
                      {settings.currency === "ETB" ? "Ethiopian Birr (Primary)" : 
                       settings.currency === "USD" ? "US Dollar" : settings.currency}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCurrencyModal(true)}
                  className="relative px-4 py-2 bg-white text-[#7B2D8B] rounded-lg text-xs font-bold hover:bg-purple-50 transition-all hover:scale-105 shadow-sm"
                >
                  Change
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-md">
                    4
                  </span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <Field label="Chapa API Key">
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    className="flex-1 bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all" 
                    placeholder="CHASECK-••••••••••••••••••••"
                    onChange={(e) => update("chapaApiKey", e.target.value)}
                  />
                  <button 
                    onClick={() => handleTestConnection("Chapa")}
                    className="relative px-4 py-2 bg-[#7B2D8B] text-white rounded-lg text-xs font-bold hover:bg-purple-800 transition-all hover:scale-105 shadow-md whitespace-nowrap"
                  >
                    TEST CONNECTION
                    {connectionStatus.chapa && (
                      <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center shadow-md ${
                        connectionStatus.chapa === "success" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : 
                        connectionStatus.chapa === "testing" ? "bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse" :
                        "bg-gradient-to-r from-red-500 to-red-600"
                      }`}>
                        {connectionStatus.chapa === "success" ? "✓" : connectionStatus.chapa === "testing" ? "..." : "✗"}
                      </span>
                    )}
                  </button>
                </div>
              </Field>
              <Field label="TeleBirr Merchant ID">
                <div className="flex gap-2">
                  <input 
                    className="flex-1 bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all" 
                    placeholder="TB-•••••••••••••"
                    onChange={(e) => update("telebirrMerchantId", e.target.value)}
                  />
                  <button 
                    onClick={() => handleTestConnection("TeleBirr")}
                    className="relative px-4 py-2 bg-[#7B2D8B] text-white rounded-lg text-xs font-bold hover:bg-purple-800 transition-all hover:scale-105 shadow-md whitespace-nowrap"
                  >
                    TEST CONNECTION
                    {connectionStatus.telebirr && (
                      <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center shadow-md ${
                        connectionStatus.telebirr === "success" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : 
                        connectionStatus.telebirr === "testing" ? "bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse" :
                        "bg-gradient-to-r from-red-500 to-red-600"
                      }`}>
                        {connectionStatus.telebirr === "success" ? "✓" : connectionStatus.telebirr === "testing" ? "..." : "✗"}
                      </span>
                    )}
                  </button>
                </div>
              </Field>
            </div>
          </SectionCard>

          {/* Storage Management */}
          <SectionCard title="Storage Management" icon="storage">
            <Field label="Max Upload Size">
              <p className="text-sm text-gray-500 mb-3">Allocated per medical record</p>
              <div className="bg-gradient-to-r from-[#fdf0f9] to-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-4 mb-2">
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={settings.maxFileSize} 
                    onChange={e => update("maxFileSize", Number(e.target.value))} 
                    className="flex-1 h-2 accent-[#7B2D8B] cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #7B2D8B 0%, #7B2D8B ${(settings.maxFileSize / 50) * 100}%, #e5e7eb ${(settings.maxFileSize / 50) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-2xl font-black text-[#7B2D8B]">{settings.maxFileSize}</span>
                    <span className="text-xs font-bold text-gray-400">MB</span>
                  </div>
                </div>
              </div>
            </Field>
            
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Allowed File Types</p>
              <div className="flex flex-wrap gap-2">
                {fileTypes.map((type) => (
                  <span key={type} className="group relative px-4 py-2 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                    {type}
                    <button 
                      onClick={() => removeFileType(type)}
                      className="hover:bg-white/30 rounded-full w-5 h-5 flex items-center justify-center transition-all hover:rotate-90"
                    >
                      ×
                    </button>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-[#7B2D8B] rounded-full text-[9px] font-black flex items-center justify-center shadow-sm">
                      {Math.floor(Math.random() * 99) + 1}
                    </span>
                  </span>
                ))}
                <div className="relative">
                  <input
                    type="text"
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addFileType()}
                    placeholder="Type & Enter"
                    className="px-4 py-2 border-2 border-dashed border-purple-300 text-[#7B2D8B] rounded-full text-xs font-bold hover:border-[#7B2D8B] focus:outline-none focus:border-[#7B2D8B] focus:bg-[#fdf0f9] transition-all w-32"
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Security */}
          <SectionCard title="Security" icon="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="JWT Token Expiry (Hours)">
                <div className="relative">
                  <input 
                    type="number" 
                    min="1"
                    max="168"
                    className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all" 
                    value={settings.jwtExpiry || 24}
                    onChange={(e) => update("jwtExpiry", e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">hrs</span>
                </div>
              </Field>
              <Field label="API Rate Limit (Req/Min)">
                <div className="relative">
                  <input 
                    type="number" 
                    min="100"
                    max="10000"
                    step="100"
                    className="w-full bg-[#fdf0f9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all" 
                    value={settings.rateLimit || 1000}
                    onChange={(e) => update("rateLimit", e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">req/m</span>
                </div>
              </Field>
            </div>
            
            <div className="bg-gradient-to-r from-[#fdf0f9] to-purple-50 rounded-xl p-4 border border-purple-100 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] rounded-lg flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-white text-lg">shield</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Two-Factor Auth</p>
                    <p className="text-xs text-gray-500">Require 2FA for all admins</p>
                  </div>
                </div>
                <Toggle checked={settings.twoFactor} onChange={v => update("twoFactor", v)} />
              </div>
            </div>
          </SectionCard>

          {/* Notifications */}
          <SectionCard title="Notifications" icon="notifications">
            <div className="space-y-4">
              {[
                { key: "emailNotifs", label: "Email Alerts", icon: "mail", color: "blue" },
                { key: "inAppNotifs", label: "In-app Banners", icon: "notifications_active", color: "purple" },
                { key: "criticalAlerts", label: "SMS Gateway", icon: "sms", color: "red", locked: true },
              ].map((item) => (
                <div key={item.key} className="bg-gradient-to-r from-[#fdf0f9] to-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${item.color === 'blue' ? 'from-blue-500 to-blue-600' : item.color === 'red' ? 'from-red-500 to-red-600' : 'from-[#7B2D8B] to-[#9d3fb0]'} rounded-lg flex items-center justify-center shadow-md`}>
                        <span className="material-symbols-outlined text-white text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                          {item.label}
                          {item.locked && (
                            <span className="material-symbols-outlined text-xs text-gray-400" title="Cannot be disabled">lock</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Toggle checked={settings[item.key]} onChange={item.locked ? () => {} : v => update(item.key, v)} locked={item.locked} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Danger Zone */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-300 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="material-symbols-outlined text-white text-xl">warning</span>
              </div>
              <div>
                <h4 className="font-black text-red-700 text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">shield</span>
                  Danger Zone
                </h4>
                <p className="text-xs text-red-500 font-medium">These actions are destructive and cannot be reversed. Please proceed with extreme caution.</p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setDangerModal("clear_notifs")}
                className="relative w-full flex items-center justify-between px-5 py-3.5 bg-white border-2 border-red-300 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 hover:border-red-400 transition-all hover:scale-[1.02] shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">delete_sweep</span>
                  Clear System Logs
                </span>
                <span className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black">
                    {systemStats.logCount} logs
                  </span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </span>
              </button>
              <button
                onClick={() => setDangerModal("reset_platform")}
                className="relative w-full flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-sm hover:from-red-700 hover:to-red-800 transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">restart_alt</span>
                  Reset Platform Configuration
                </span>
                <span className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-white/20 text-white rounded-full text-[10px] font-black">
                    {systemStats.configCount} configs
                  </span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
