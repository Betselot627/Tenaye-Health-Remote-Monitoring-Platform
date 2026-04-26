import { useState, useEffect } from "react";
import PatientLayout from "../../components/layout/PatientLayout";

const mockBilling = [
  {
    _id: "1",
    description: "Cardiology Consultation — Dr. Amanuel Tesfaye",
    date: "2025-04-26",
    amount: 500,
    status: "paid",
    gateway: "Chapa",
  },
  {
    _id: "2",
    description: "Pediatrics Consultation — Dr. Meron Alemu",
    date: "2025-04-24",
    amount: 400,
    status: "paid",
    gateway: "Telebirr",
  },
  {
    _id: "3",
    description: "Neurology Consultation — Dr. Dawit Bekele",
    date: "2025-04-20",
    amount: 600,
    status: "pending",
    gateway: "Chapa",
  },
  {
    _id: "4",
    description: "Dermatology Consultation — Dr. Hiwot Girma",
    date: "2025-04-15",
    amount: 450,
    status: "paid",
    gateway: "Telebirr",
  },
];

const statusColors = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
};

const gatewayIcons = {
  Chapa: "account_balance",
  Telebirr: "phone_android",
};

export default function Billing() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setTransactions(mockBilling);
      setLoading(false);
    }, 400);
  }, []);

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.status === filter);
  const totalPaid = transactions
    .filter((t) => t.status === "paid")
    .reduce((s, t) => s + t.amount, 0);
  const totalPending = transactions
    .filter((t) => t.status === "pending")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800">Billing</h1>
          <p className="text-gray-400 mt-1">
            Your payment history and outstanding balances
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Paid",
              value: `${totalPaid.toLocaleString()} ETB`,
              icon: "check_circle",
              color: "from-emerald-600 to-emerald-500",
            },
            {
              label: "Pending",
              value: `${totalPending.toLocaleString()} ETB`,
              icon: "schedule",
              color: "from-amber-600 to-amber-500",
            },
            {
              label: "Transactions",
              value: transactions.length,
              icon: "receipt_long",
              color: "from-[#632a7e] to-[#8b3fb0]",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white`}
            >
              <span className="material-symbols-outlined text-2xl opacity-80">
                {s.icon}
              </span>
              <p className="text-2xl font-black mt-2">{s.value}</p>
              <p className="text-xs font-semibold opacity-80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="font-bold text-gray-800">Transaction History</h2>
            <div className="flex gap-2">
              {["all", "paid", "pending"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                    filter === s
                      ? "bg-[#632a7e] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-7 h-7 border-4 border-[#632a7e] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#632a7e] text-lg">
                      {gatewayIcons[t.gateway] ?? "credit_card"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {t.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t.date} · {t.gateway}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-800 text-sm">
                      {t.amount} ETB
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">
                  No transactions found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}
