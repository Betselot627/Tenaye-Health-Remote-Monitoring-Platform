import { useState, useEffect } from "react";
import DoctorLayout from "./components/DoctorLayout";
import { getDoctorPrescriptions, downloadPrescriptionPDF, getDoctorPatients, createPrescription } from "../../services/patientService";

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

function NewPrescriptionModal({ onClose, onSave, patients }) {
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    medication: "",
    dosage: "",
    duration: "",
    diagnosis: "",
    notes: "",
  });

  const handlePatientChange = (e) => {
    const selected = patients.find(p => p._id === e.target.value);
    setForm({
      ...form,
      patientId: e.target.value,
      patientName: selected?.full_name || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patientId || !form.medication) return;
    onSave({
      patient: form.patientId,
      medications: [{
        name: form.medication,
        dosage: form.dosage,
        duration: form.duration,
      }],
      diagnosis: form.diagnosis,
      notes: form.notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
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
          {/* Patient Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Patient
            </label>
            <select
              value={form.patientId}
              onChange={handlePatientChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20 bg-white"
              required
            >
              <option value="">Select a patient...</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.full_name} ({patient.email})
                </option>
              ))}
            </select>
            {patients.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                No patients found. You need to have at least one appointment with a patient.
              </p>
            )}
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Diagnosis
            </label>
            <input
              type="text"
              placeholder="e.g. Hypertension"
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20"
            />
          </div>

          {/* Medication */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Medication
            </label>
            <input
              type="text"
              placeholder="e.g. Amlodipine 5mg"
              value={form.medication}
              onChange={(e) => setForm({ ...form, medication: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20"
              required
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Dosage
            </label>
            <input
              type="text"
              placeholder="e.g. 1x daily"
              value={form.dosage}
              onChange={(e) => setForm({ ...form, dosage: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Duration
            </label>
            <input
              type="text"
              placeholder="e.g. 30 days"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
              Notes
            </label>
            <textarea
              placeholder="Additional instructions..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20 resize-none"
              rows="3"
            />
          </div>
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
              className="flex-1 py-3 bg-[#0D7377] text-white rounded-xl font-bold text-sm hover:bg-[#0a5c60] transition-colors"
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
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [prescriptionsResult, patientsResult] = await Promise.all([
        getDoctorPrescriptions(),
        getDoctorPatients(),
      ]);

      if (prescriptionsResult.data) {
        // Transform backend data to match UI format
        const transformed = prescriptionsResult.data.map((rx) => ({
          id: rx._id,
          patient: rx.patient?.full_name || "Patient",
          patientEmail: rx.patient?.email,
          medication: rx.medications?.[0]?.name || "Prescription",
          dosage: rx.medications?.[0]?.dosage || "",
          duration: rx.medications?.[0]?.duration || "",
          status: rx.status || "active",
          date: rx.createdAt ? new Date(rx.createdAt).toISOString().split("T")[0] : "",
          diagnosis: rx.diagnosis,
          notes: rx.notes,
          allMedications: rx.medications || [],
        }));
        setPrescriptions(transformed);
      }

      if (patientsResult.data) {
        setPatients(patientsResult.data);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (prescriptionData) => {
    // Call API to save prescription
    const result = await createPrescription(prescriptionData);

    if (result.error) {
      showToast(result.error, "error");
      return;
    }

    setShowModal(false);
    showToast("Prescription created and sent to patient successfully");

    // Refresh prescriptions list
    const refreshResult = await getDoctorPrescriptions();
    if (refreshResult.data) {
      const transformed = refreshResult.data.map((rx) => ({
        id: rx._id,
        patient: rx.patient?.full_name || "Patient",
        patientEmail: rx.patient?.email,
        medication: rx.medications?.[0]?.name || "Prescription",
        dosage: rx.medications?.[0]?.dosage || "",
        duration: rx.medications?.[0]?.duration || "",
        status: rx.status || "active",
        date: rx.createdAt ? new Date(rx.createdAt).toISOString().split("T")[0] : "",
        diagnosis: rx.diagnosis,
        notes: rx.notes,
        allMedications: rx.medications || [],
      }));
      setPrescriptions(transformed);
    }
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
          <div className="w-8 h-8 border-4 border-[#0D7377] border-t-transparent rounded-full animate-spin" />
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
          patients={patients}
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D7377]/20"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0D7377] text-white rounded-xl font-bold text-sm hover:bg-[#0a5c60] transition-colors"
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
                  "Actions",
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
                  <td className="py-4">
                    <button
                      onClick={() => downloadPrescriptionPDF(rx.id)}
                      className="p-2 text-[#0D7377] hover:bg-teal-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <span className="material-symbols-outlined text-lg">
                        download
                      </span>
                    </button>
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
