import { useState } from "react";
import PatientLayout from "./components/PatientLayout";
import { mockLabResults } from "./data/mockData";

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const resultStatusColors = {
  normal: "text-emerald-600 bg-emerald-50",
  borderline: "text-amber-600 bg-amber-50",
  high: "text-red-600 bg-red-50",
  low: "text-blue-600 bg-blue-50",
};

function LabDetailModal({ lab, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] p-6 text-white relative flex-shrink-0">
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
                biotech
              </span>
            </div>
            <div>
              <h3 className="font-black text-lg">{lab.test}</h3>
              <p className="text-white/80 text-sm">
                {lab.id} · {lab.lab}
              </p>
            </div>
          </div>
          <span
            className={`mt-3 inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${lab.status === "completed" ? "bg-emerald-400/30 text-white" : "bg-amber-400/30 text-white"}`}
          >
            {lab.status === "completed" ? "Results Available" : "Pending"}
          </span>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "person", label: "Ordered By", value: lab.doctor },
              {
                icon: "calendar_today",
                label: "Ordered Date",
                value: lab.orderedDate,
              },
              { icon: "local_hospital", label: "Lab", value: lab.lab },
              {
                icon: "check_circle",
                label: "Completed",
                value: lab.completedDate || "Pending",
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="p-3 bg-[#fdf0f9]/40 rounded-xl">
                <span className="material-symbols-outlined text-[#7B2D8B] text-lg">
                  {icon}
                </span>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
                <p className="text-sm font-bold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {lab.results ? (
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7B2D8B]">
                  analytics
                </span>
                Test Results
              </h4>
              <div className="space-y-2">
                {Object.entries(lab.results).map(([key, { value, status }]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <p className="text-sm font-semibold text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">
                        {value}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${resultStatusColors[status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-amber-50 rounded-xl border border-amber-100">
              <span className="material-symbols-outlined text-3xl text-amber-400">
                hourglass_empty
              </span>
              <p className="text-amber-700 font-bold text-sm mt-2">
                Results Pending
              </p>
              <p className="text-amber-600 text-xs mt-1">
                You'll be notified when results are ready
              </p>
            </div>
          )}

          {lab.notes && (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-600 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>{" "}
                Doctor's Notes
              </p>
              <p className="text-sm text-gray-700 mt-1">{lab.notes}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex-shrink-0">
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

export default function PatientLabResults() {
  const [labs] = useState(mockLabResults);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered =
    filter === "all" ? labs : labs.filter((l) => l.status === filter);

  return (
    <PatientLayout title="Lab Results">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-[#7B2D8B] flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">biotech</span>
            Lab Results
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {labs.filter((l) => l.status === "pending").length} pending ·{" "}
            {labs.filter((l) => l.status === "completed").length} completed
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? "bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white shadow-lg shadow-purple-200" : "bg-white text-gray-500 border border-gray-200 hover:border-purple-300 hover:text-[#7B2D8B]"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span
                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${filter === f ? "bg-white/20" : "bg-gray-100"}`}
              >
                {f === "all"
                  ? labs.length
                  : labs.filter((l) => l.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Lab cards */}
        <div className="space-y-3">
          {filtered.map((lab) => (
            <div
              key={lab.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-5 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0 ${lab.status === "pending" ? "bg-amber-100" : "bg-emerald-100"}`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${lab.status === "pending" ? "text-amber-600" : "text-emerald-600"}`}
                    >
                      {lab.status === "pending"
                        ? "hourglass_empty"
                        : "check_circle"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">
                      {lab.test}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {lab.id} · {lab.doctor}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs">
                        local_hospital
                      </span>
                      {lab.lab} · Ordered {lab.orderedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[lab.status]}`}
                  >
                    {lab.status === "completed" ? "Results Ready" : "Pending"}
                  </span>
                  <button
                    onClick={() => setSelected(lab)}
                    className="p-2 rounded-xl bg-gradient-to-br from-[#fdf0f9] to-purple-50 text-[#7B2D8B] hover:from-purple-100 transition-all hover:scale-110 border border-purple-100"
                  >
                    <span className="material-symbols-outlined text-lg">
                      open_in_new
                    </span>
                  </button>
                </div>
              </div>

              {lab.results && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  {Object.entries(lab.results)
                    .slice(0, 3)
                    .map(([key, { value, status }]) => (
                      <span
                        key={key}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${resultStatusColors[status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {key.replace(/([A-Z])/g, " $1").trim()}: {value}
                      </span>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <span className="material-symbols-outlined text-5xl text-gray-200">
              biotech
            </span>
            <p className="text-gray-400 mt-3">No {filter} lab results</p>
          </div>
        )}
      </div>

      {selected && (
        <LabDetailModal lab={selected} onClose={() => setSelected(null)} />
      )}
    </PatientLayout>
  );
}
