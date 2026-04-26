import { useState, useEffect } from "react";
import DoctorLayout from "./components/DoctorLayout";
import { mockLabOrders } from "./data/mockData";

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
};

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
      ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined text-lg">check_circle</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

function NewLabOrderModal({ onClose, onSave }) {
  const [form, setForm] = useState({ patient: "", test: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patient || !form.test) return;
    onSave({
      id: `LAB-${Date.now()}`,
      ...form,
      ordered: new Date().toISOString().split("T")[0],
      status: "pending",
      result: null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">New Lab Order</h3>
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
              key: "test",
              label: "Test / Procedure",
              placeholder: "e.g. Complete Blood Count",
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
              Order Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DoctorLabOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockLabOrders);
      setLoading(false);
    }, 400);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (order) => {
    setOrders((prev) => [order, ...prev]);
    setShowModal(false);
    showToast("Lab order created successfully");
  };

  const filtered =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  if (loading)
    return (
      <DoctorLayout title="Lab Orders">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin" />
        </div>
      </DoctorLayout>
    );

  return (
    <DoctorLayout title="Lab Orders">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {showModal && (
        <NewLabOrderModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2 flex-1">
            {["all", "pending", "completed"].map((s) => (
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
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7B2D8B] text-white rounded-xl font-bold text-sm hover:bg-[#6a2578] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Order
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["ID", "Patient", "Test", "Ordered", "Status", "Result"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 pr-4 font-mono text-xs text-gray-400">
                    {o.id}
                  </td>
                  <td className="py-4 pr-4 font-semibold text-gray-800">
                    {o.patient}
                  </td>
                  <td className="py-4 pr-4 text-gray-700">{o.test}</td>
                  <td className="py-4 pr-4 text-gray-500">{o.ordered}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-500">
                    {o.result ?? (
                      <span className="text-gray-300 italic">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">
              No lab orders found.
            </p>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}
