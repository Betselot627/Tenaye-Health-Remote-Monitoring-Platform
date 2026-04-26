import AdminLayout from "./components/AdminLayout";

const records = [
  { id: "REC-001", patient: "Bereket Tadesse", type: "Consultation Notes", doctor: "Dr. Alem Bekele", date: "2025-04-26", status: "Active" },
  { id: "REC-002", patient: "Sara Haile", type: "Prescription", doctor: "Dr. Tigist Worku", date: "2025-04-25", status: "Active" },
  { id: "REC-003", patient: "Yonas Bekele", type: "Lab Order", doctor: "Dr. Michael Chen", date: "2025-04-25", status: "Active" },
  { id: "REC-004", patient: "Tigist Worku", type: "Tracker", doctor: "System", date: "2025-04-24", status: "Active" },
  { id: "REC-005", patient: "Abebe Girma", type: "Vaccination", doctor: "Dr. Sara Jenkins", date: "2025-04-23", status: "Archived" },
];

const typeColors = {
  "Consultation Notes": "bg-blue-100 text-blue-700",
  "Prescription": "bg-purple-100 text-purple-700",
  "Lab Order": "bg-amber-100 text-amber-700",
  "Tracker": "bg-emerald-100 text-emerald-700",
  "Vaccination": "bg-teal-100 text-teal-700",
};

const criticalAlerts = [
  { patient: "Bereket Tadesse", alert: "Critical SpO2: 88%", time: "2 mins ago" },
  { patient: "Sara Haile", alert: "Blood Sugar: 210 mg/dL (Post-meal)", time: "15 mins ago" },
  { patient: "Yonas Bekele", alert: "Heart Rate: 155 BPM", time: "1 hour ago" },
];

export default function AdminMedicalRecords() {
  return (
    <AdminLayout title="Medical Records">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Medical Records</h2>
          <p className="text-gray-400 mt-1">Patient health data oversight</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-full font-bold hover:bg-purple-100 transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Export Records
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Records", value: "45,821", color: "text-[#7B2D8B]" },
          { label: "Critical Alerts", value: "12", color: "text-red-600", bg: "bg-red-50" },
          { label: "Records This Week", value: "892", color: "text-emerald-600" },
          { label: "Pending Lab Orders", value: "67", color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className={`p-6 rounded-2xl shadow-sm ${s.bg || "bg-white"}`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Critical Alerts */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-red-600">emergency</span>
          <h4 className="font-bold text-red-700">Critical Vital Alerts</h4>
          <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{criticalAlerts.length}</span>
        </div>
        <div className="space-y-3">
          {criticalAlerts.map((alert, i) => (
            <div key={i} className="flex items-center justify-between bg-white p-4 rounded-xl border border-red-100">
              <div>
                <p className="font-bold text-gray-800 text-sm">{alert.patient}</p>
                <p className="text-xs text-red-600 font-semibold">{alert.alert}</p>
                <p className="text-xs text-gray-400">{alert.time}</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors">
                Notify Doctor
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fdf0f9]/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-6 py-5">Record ID</th>
                <th className="px-6 py-5">Patient</th>
                <th className="px-6 py-5">Record Type</th>
                <th className="px-6 py-5">Doctor</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">{rec.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{rec.patient}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeColors[rec.type]}`}>{rec.type}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{rec.doctor}</td>
                  <td className="px-6 py-4 text-gray-400">{rec.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${rec.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-[#7B2D8B] hover:bg-purple-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
