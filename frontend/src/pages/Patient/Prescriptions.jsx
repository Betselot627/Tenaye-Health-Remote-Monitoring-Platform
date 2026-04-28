import { useState } from "react";
import PatientLayout from "./components/PatientLayout";
import { mockPatientPrescriptions } from "./data/mockData";

const statusColors = {
  active: "bg-emerald-100 text-emerald-700",
  expired: "bg-red-100 text-red-700",
};

function PrescriptionModal({ rx, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-[#E05C8A] to-[#F4845F] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined text-white text-lg">
              close
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">
                medication
              </span>
            </div>
            <div>
              <h3 className="font-black text-lg">{rx.medication}</h3>
              <p className="text-white/80 text-sm">{rx.id}</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {[
            { icon: "person", label: "Prescribed By", value: rx.doctor },
            { icon: "medication_liquid", label: "Dosage", value: rx.dosage },
            { icon: "timer", label: "Duration", value: rx.duration },
            {
              icon: "autorenew",
              label: "Refills Remaining",
              value: `${rx.refills} refills`,
            },
            {
              icon: "calendar_today",
              label: "Issued Date",
              value: rx.issuedDate,
            },
            { icon: "event_busy", label: "Expiry Date", value: rx.expiryDate },
            { icon: "local_pharmacy", label: "Pharmacy", value: rx.pharmacy },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 bg-[#fff5f7]/40 rounded-xl"
            >
              <span className="material-symbols-outlined text-[#E05C8A] text-lg">
                {icon}
              </span>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-600 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">info</span>{" "}
              Instructions
            </p>
            <p className="text-sm text-gray-700 mt-1">{rx.instructions}</p>
          </div>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientPrescriptions() {
  const [prescriptions] = useState(mockPatientPrescriptions);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered =
    filter === "all"
      ? prescriptions
      : prescriptions.filter((p) => p.status === filter);

  return (
    <PatientLayout title="Prescriptions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#E05C8A] flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl">
                medication
              </span>
              My Prescriptions
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              {prescriptions.filter((p) => p.status === "active").length} active
              prescriptions
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {["all", "active", "expired"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? "bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white shadow-lg shadow-rose-200" : "bg-white text-gray-500 border border-gray-200 hover:border-rose-300 hover:text-[#E05C8A]"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span
                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filter === f ? "bg-white/20" : "bg-gray-100"}`}
              >
                {f === "all"
                  ? prescriptions.length
                  : prescriptions.filter((p) => p.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Prescriptions grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-rose-200 transition-all duration-300 p-5 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fff5f7] to-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <span className="material-symbols-outlined text-[#E05C8A] text-xl">
                      medication
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">
                      {rx.medication}
                    </p>
                    <p className="text-xs text-gray-500">
                      {rx.id} · {rx.doctor}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[rx.status]}`}
                >
                  {rx.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {[
                  {
                    icon: "medication_liquid",
                    label: "Dosage",
                    value: rx.dosage,
                  },
                  { icon: "timer", label: "Duration", value: rx.duration },
                  {
                    icon: "autorenew",
                    label: "Refills",
                    value: `${rx.refills} left`,
                  },
                  {
                    icon: "event_busy",
                    label: "Expires",
                    value: rx.expiryDate,
                  },
                ].map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-gray-500"
                  >
                    <span className="material-symbols-outlined text-sm text-[#E05C8A]">
                      {icon}
                    </span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              {rx.status === "active" && rx.refills === 0 && (
                <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    warning
                  </span>
                  No refills remaining — contact your doctor
                </div>
              )}

              <button
                onClick={() => setSelected(rx)}
                className="w-full mt-4 py-2 bg-gradient-to-r from-[#fff5f7] to-rose-50 text-[#E05C8A] text-xs font-bold rounded-xl hover:from-rose-100 transition-all border border-rose-100"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <span className="material-symbols-outlined text-5xl text-gray-200">
              medication
            </span>
            <p className="text-gray-400 mt-3">No {filter} prescriptions</p>
          </div>
        )}
      </div>

      {selected && (
        <PrescriptionModal rx={selected} onClose={() => setSelected(null)} />
      )}
    </PatientLayout>
  );
}
