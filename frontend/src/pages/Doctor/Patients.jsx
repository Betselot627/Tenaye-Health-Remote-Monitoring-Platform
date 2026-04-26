import { useState, useEffect } from "react";
import DoctorLayout from "./components/DoctorLayout";
import { mockPatients } from "./data/mockData";

const statusColors = {
  active: "bg-blue-100 text-blue-700",
  critical: "bg-red-100 text-red-700",
  stable: "bg-emerald-100 text-emerald-700",
};

const rxStatusColors = {
  active: "bg-emerald-100 text-emerald-700",
  expired: "bg-gray-100 text-gray-500",
};

const labStatusColors = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
};

function PatientDetailModal({ patient, onClose }) {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "Overview", icon: "person" },
    { key: "vitals", label: "Vitals", icon: "monitor_heart" },
    { key: "prescriptions", label: "Prescriptions", icon: "medication" },
    { key: "labs", label: "Lab Orders", icon: "biotech" },
    { key: "notes", label: "Notes", icon: "notes" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#fdf0f9] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#7B2D8B] text-3xl">
                  person
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-800">
                  {patient.name}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {patient.age} yrs · {patient.gender} · {patient.bloodType}
                </p>
                <span
                  className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[patient.status]}`}
                >
                  {patient.status}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 shrink-0"
            >
              <span className="material-symbols-outlined text-gray-500 text-lg">
                close
              </span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0 border-b border-gray-100">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-[#7B2D8B] text-[#7B2D8B]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {t.icon}
                </span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "overview" && (
            <div className="space-y-3">
              {[
                { label: "Condition", value: patient.condition },
                { label: "Last Visit", value: patient.lastVisit },
                { label: "Phone", value: patient.phone },
                { label: "Email", value: patient.email },
                { label: "Blood Type", value: patient.bloodType },
                {
                  label: "Allergies",
                  value:
                    patient.allergies.length > 0
                      ? patient.allergies.join(", ")
                      : "None reported",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab === "vitals" && (
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Blood Pressure",
                  value: patient.vitals.bp,
                  icon: "favorite",
                  color: "text-red-500",
                },
                {
                  label: "Heart Rate",
                  value: patient.vitals.hr,
                  icon: "monitor_heart",
                  color: "text-pink-500",
                },
                {
                  label: "Temperature",
                  value: patient.vitals.temp,
                  icon: "thermometer",
                  color: "text-orange-500",
                },
                {
                  label: "SpO2",
                  value: patient.vitals.spo2,
                  icon: "air",
                  color: "text-blue-500",
                },
              ].map(({ label, value, icon, color }) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2"
                >
                  <span
                    className={`material-symbols-outlined text-2xl ${color}`}
                  >
                    {icon}
                  </span>
                  <p className="text-lg font-black text-gray-800">{value}</p>
                  <p className="text-xs text-gray-400 font-semibold">{label}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "prescriptions" && (
            <div className="space-y-3">
              {patient.prescriptions.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">
                  No prescriptions on record.
                </p>
              ) : (
                patient.prescriptions.map((rx, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#7B2D8B] text-xl">
                        medication
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {rx.medication}
                        </p>
                        <p className="text-xs text-gray-400">
                          {rx.dosage} · {rx.duration}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rxStatusColors[rx.status]}`}
                    >
                      {rx.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "labs" && (
            <div className="space-y-3">
              {patient.labOrders.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">
                  No lab orders on record.
                </p>
              ) : (
                patient.labOrders.map((lab, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#7B2D8B] text-xl">
                        biotech
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {lab.test}
                        </p>
                        <p className="text-xs text-gray-400">
                          Ordered: {lab.date}
                          {lab.result ? ` · Result: ${lab.result}` : ""}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${labStatusColors[lab.status]}`}
                    >
                      {lab.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "notes" && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-amber-600 text-lg">
                  notes
                </span>
                <p className="text-sm font-bold text-amber-800">
                  Clinical Notes
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {patient.notes}
              </p>
            </div>
          )}
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

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setPatients(mockPatients);
      setLoading(false);
    }, 400);
  }, []);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading)
    return (
      <DoctorLayout title="My Patients">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin" />
        </div>
      </DoctorLayout>
    );

  return (
    <DoctorLayout title="My Patients">
      {selected && (
        <PatientDetailModal
          patient={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8B]/20"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "active", "critical", "stable"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${
                  filterStatus === s
                    ? "bg-[#7B2D8B] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  "Patient",
                  "Age",
                  "Condition",
                  "Last Visit",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 pr-4">
                    <button
                      onClick={() => setSelected(p)}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#fdf0f9] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#7B2D8B] text-lg">
                          person
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800 group-hover:text-[#7B2D8B] transition-colors">
                        {p.name}
                      </span>
                    </button>
                  </td>
                  <td className="py-4 pr-4 text-gray-500">
                    {p.age} · {p.gender}
                  </td>
                  <td className="py-4 pr-4 text-gray-700">{p.condition}</td>
                  <td className="py-4 pr-4 text-gray-500">{p.lastVisit}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => setSelected(p)}
                      className="text-[#7B2D8B] hover:text-[#6a2578] font-semibold text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">
              No patients found.
            </p>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}
