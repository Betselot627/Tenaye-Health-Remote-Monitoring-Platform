import { useState } from "react";
import PatientLayout from "./components/PatientLayout";
import { mockBilling } from "./data/mockData";

const statusColors = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-blue-100 text-blue-700",
};

const methodIcons = {
  Chapa: "credit_card",
  Telebirr: "phone_android",
  Cash: "payments",
};

function ReceiptModal({ payment, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined text-white text-lg">
              close
            </span>
          </button>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-white text-3xl">
              receipt_long
            </span>
          </div>
          <h3 className="font-black text-xl">Payment Receipt</h3>
          <p className="text-white/80 text-sm mt-1">{payment.receipt}</p>
        </div>
        <div className="p-6 space-y-3">
          {[
            { label: "Description", value: payment.description },
            { label: "Doctor", value: payment.doctor },
            { label: "Date", value: payment.date },
            { label: "Payment Method", value: payment.method },
            {
              label: "Status",
              value:
                payment.status.charAt(0).toUpperCase() +
                payment.status.slice(1),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between items-center py-2 border-b border-gray-50"
            >
              <span className="text-xs text-gray-400 font-semibold">
                {label}
              </span>
              <span className="text-sm font-bold text-gray-800">{value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center py-3 bg-gradient-to-r from-[#fdf0f9] to-purple-50 rounded-xl px-3 mt-2">
            <span className="text-sm font-black text-gray-700">
              Total Amount
            </span>
            <span className="text-xl font-black text-[#7B2D8B]">
              {payment.amount} ETB
            </span>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button className="flex-1 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Download
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientBilling() {
  const [payments] = useState(mockBilling);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered =
    filter === "all" ? payments : payments.filter((p) => p.status === filter);
  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <PatientLayout title="Billing">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-[#7B2D8B] flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">payments</span>
            Billing & Payments
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {payments.length} transactions
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Paid",
              value: `${totalPaid.toLocaleString()} ETB`,
              icon: "check_circle",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
            },
            {
              label: "Pending",
              value: `${totalPending.toLocaleString()} ETB`,
              icon: "schedule",
              color: "text-amber-600",
              bg: "bg-amber-50",
              border: "border-amber-100",
            },
            {
              label: "Total Transactions",
              value: payments.length,
              icon: "receipt_long",
              color: "text-[#7B2D8B]",
              bg: "bg-[#fdf0f9]",
              border: "border-purple-100",
            },
          ].map(({ label, value, icon, color, bg, border }) => (
            <div
              key={label}
              className={`${bg} border ${border} rounded-2xl p-5 flex items-center gap-4`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shadow-sm border ${border}`}
              >
                <span className={`material-symbols-outlined text-xl ${color}`}>
                  {icon}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {label}
                </p>
                <p className={`text-xl font-black ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {["all", "paid", "pending", "refunded"].map((f) => (
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
                  ? payments.length
                  : payments.filter((p) => p.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Payments list */}
        <div className="space-y-3">
          {filtered.map((pay) => (
            <div
              key={pay.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-5 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fdf0f9] to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                    <span className="material-symbols-outlined text-[#7B2D8B] text-xl">
                      {methodIcons[pay.method] || "payments"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">
                      {pay.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{pay.doctor}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs">
                        calendar_today
                      </span>
                      {pay.date} · via {pay.method}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-800">
                      {pay.amount} ETB
                    </p>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[pay.status]}`}
                    >
                      {pay.status}
                    </span>
                  </div>
                  {pay.receipt && (
                    <button
                      onClick={() => setSelected(pay)}
                      className="p-2 rounded-xl bg-gradient-to-br from-[#fdf0f9] to-purple-50 text-[#7B2D8B] hover:from-purple-100 transition-all hover:scale-110 border border-purple-100"
                    >
                      <span className="material-symbols-outlined text-lg">
                        receipt_long
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <span className="material-symbols-outlined text-5xl text-gray-200">
              payments
            </span>
            <p className="text-gray-400 mt-3">No {filter} payments</p>
          </div>
        )}
      </div>

      {selected && (
        <ReceiptModal payment={selected} onClose={() => setSelected(null)} />
      )}
    </PatientLayout>
  );
}
