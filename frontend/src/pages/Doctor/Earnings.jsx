import { useState, useEffect } from "react";
import DoctorLayout from "./components/DoctorLayout";
import { getDoctorEarnings } from "../../services/patientService";

const statusColors = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
};

const gatewayIcons = {
  chapa: "account_balance",
  telebirr: "phone_android",
};

export default function DoctorEarnings() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalPending: 0,
    monthlyEarnings: 0,
  });

  useEffect(() => {
    const fetchEarnings = async () => {
      const result = await getDoctorEarnings();
      if (result.data) {
        // Transform backend data to match UI format
        const transformed = result.data.payments.map((p) => ({
          id: p._id?.slice(-8) || "N/A",
          patient: p.patient?.full_name || "Patient",
          amount: p.amount,
          gateway: p.gateway || "receipt",
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A",
          status: p.status === "paid" ? "paid" : "pending",
        }));
        setTransactions(transformed);
        setStats(result.data.stats || {
          totalPaid: 0,
          totalPending: 0,
          monthlyEarnings: 0,
        });
      }
      setLoading(false);
    };
    fetchEarnings();
  }, []);

  const filtered =
    filterStatus === "all"
      ? transactions
      : transactions.filter((t) => t.status === filterStatus);

  const totalPaid = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading)
    return (
      <DoctorLayout title="Earnings">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#0D7377] border-t-transparent rounded-full animate-spin" />
        </div>
      </DoctorLayout>
    );

  return (
    <DoctorLayout title="Earnings">
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Monthly Earnings",
              value: `${stats.monthlyEarnings?.toLocaleString() || 0} ETB`,
              icon: "payments",
              color: "from-[#0D7377] to-[#14A085]",
            },
            {
              label: "Total Received",
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
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white`}
            >
              <span className="material-symbols-outlined text-3xl opacity-80">
                {s.icon}
              </span>
              <p className="text-2xl font-black mt-2">{s.value}</p>
              <p className="text-xs font-semibold opacity-80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-800">Transactions</h2>
            <div className="flex gap-2">
              {["all", "paid", "pending"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                    filterStatus === s
                      ? "bg-[#0D7377] text-white"
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
                  {["ID", "Patient", "Amount", "Gateway", "Date", "Status"].map(
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
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 pr-4 font-mono text-xs text-gray-400">
                      {t.id}
                    </td>
                    <td className="py-4 pr-4 font-semibold text-gray-800">
                      {t.patient}
                    </td>
                    <td className="py-4 pr-4 font-bold text-gray-800">
                      {t.amount} ETB
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <span className="material-symbols-outlined text-base">
                          {gatewayIcons[t.gateway] ?? "credit_card"}
                        </span>
                        <span className="capitalize">{t.gateway}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-gray-500">{t.date}</td>
                    <td className="py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[t.status]}`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-10">
                No transactions found.
              </p>
            )}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
