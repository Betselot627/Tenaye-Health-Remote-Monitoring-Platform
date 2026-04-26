import { useState, useEffect } from "react";
import DoctorLayout from "./components/DoctorLayout";
import { mockPrescriptions } from "./data/mockData";

const statusColors = {
  active: "bg-emerald-100 text-emerald-700",
  expired: "bg-gray-100 text-gray-500",
};

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
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

function NewPrescriptionModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    patient: "",
    medication: "",
    dosage: "",
    duration: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patient || !form.medication) return;
    onSave({
      id: `RX-${Date.now()}`,
      ...form,
      date: new Date().toISOString().split("T")[0],
      status: "active",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">New Prescription</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-gray-500 text-lg">
              close
            </span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "patient", label: "Patient Name", placeholder: "Full name" },
            {
              key: "medication",
              label: "Medication",
              placeholder: "e.g. Amlodipine 5mg",
            },
            {
              key: "dosage",
              label: "Dosage",
              placeholder: "e.g. 1x daily",
            },
            {
              key: "duration",
              label: "Duration",
              placeholder: "e.g. 30 days",
            },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                {label}
              </label>
              <input
                type="text"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8B]/20"
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#7B2D8B] text-white rounded-xl font-bold text-sm hover:bg-[#6a2578] transition-colors"
            >
              Save Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setPrescriptions(mockPrescriptions);
      setLoading(false);
    }, 400);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (rx) => {
    setPrescriptions((prev) => [rx, ...prev]);
    setShowModal(false);
    showToast("Prescription saved successfully");
  };

  const filtered = prescriptions.filter(
    (rx) =>
      rx.patient.toLowerCase().includes(search.toLowerCase()) ||
      rx.medication.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <DoctorLayout title="Prescriptions">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin" />
        </div>
      </DoctorLayout>
    );

  return (
    <DoctorLayout title="Prescriptions">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {showModal && (
        <NewPrescriptionModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
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
              placeholder="Search prescriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D8B]/20"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7B2D8B] text-white rounded-xl font-bold text-sm hover:bg-[#6a2578] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Prescription
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  "ID",
                  "Patient",
                  "Medication",
                  "Dosage",
                  "Duration",
                  "Date",
                  "Status",
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
              {filtered.map((rx) => (
                <tr key={rx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 pr-4 font-mono text-xs text-gray-400">
                    {rx.id}
                  </td>
                  <td className="py-4 pr-4 font-semibold text-gray-800">
                    {rx.patient}
                  </td>
                  <td className="py-4 pr-4 text-gray-700">{rx.medication}</td>
                  <td className="py-4 pr-4 text-gray-500">{rx.dosage}</td>
                  <td className="py-4 pr-4 text-gray-500">{rx.duration}</td>
                  <td className="py-4 pr-4 text-gray-500">{rx.date}</td>
                  <td className="py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[rx.status]}`}
                    >
                      {rx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">
              No prescriptions found.
            </p>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}
