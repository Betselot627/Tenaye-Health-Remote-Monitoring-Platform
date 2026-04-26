import { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { mockPayments, mockStats } from "./data/mockData";

const statusColors = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-blue-100 text-blue-700",
};

const gatewayColors = {
  chapa: "bg-purple-100 text-purple-700",
  telebirr: "bg-teal-100 text-teal-700",
};

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = mockPayments.filter((p) => activeTab === "all" || p.status === activeTab);

  return (
    <AdminLayout title="Payments & Revenue">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Payments & Revenue</h2>
          <p className="text-gray-400 mt-1">Financial overview and transaction management</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-full font-bold hover:bg-purple-100 transition-colors">
          <span className="material-symbols-outlined text-sm">download</span>
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#600f72] p-6 rounded-2xl text-white col-span-2 md:col-span-1">
          <span className="material-symbols-outlined mb-3 block opacity-70">payments</span>
          <p className="text-3xl font-black">{(mockStats.totalRevenue / 1000000).toFixed(1)}M</p>
          <p className="text-xs font-semibold opacity-70 uppercase tracking-wider mt-1">Total Revenue (ETB)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-emerald-600 mb-3 block">trending_up</span>
          <p className="text-3xl font-black text-emerald-600">842K</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">This Month</p>
          <p className="text-xs text-emerald-500 font-bold mt-1">+22% growth</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl">
          <span className="material-symbols-outlined text-amber-500 mb-3 block">pending</span>
          <p className="text-3xl font-black text-amber-600">34</p>
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mt-1">Pending Payments</p>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl">
          <span className="material-symbols-outlined text-red-500 mb-3 block">error</span>
          <p className="text-3xl font-black text-red-600">{mockStats.failedPayments}</p>
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mt-1">Failed Transactions</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <h4 className="text-lg font-bold text-gray-800 mb-6">Monthly Revenue (ETB)</h4>
          <div className="flex items-end justify-around h-40 gap-3">
            {[
              { month: "Nov", height: "60%", value: "1.2M" },
              { month: "Dec", height: "85%", value: "1.8M" },
              { month: "Jan", height: "45%", value: "0.9M" },
              { month: "Feb", height: "100%", value: "2.1M", active: true },
              { month: "Mar", height: "70%", value: "1.4M" },
              { month: "Apr", height: "55%", value: "1.1M" },
            ].map((bar) => (
              <div key={bar.month} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-full rounded-t-xl transition-all hover:opacity-80 cursor-pointer ${bar.active ? "bg-[#7B2D8B]" : "bg-[#fdf0f9]"}`}
                  style={{ height: bar.height }}
                  title={bar.value}
                ></div>
                <span className="text-xs font-bold text-gray-400">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h4 className="text-lg font-bold text-gray-800 mb-6">By Gateway</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Chapa</span>
                <span className="font-bold text-[#7B2D8B]">62%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-[#7B2D8B] h-3 rounded-full" style={{ width: "62%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">TeleBirr</span>
                <span className="font-bold text-teal-600">38%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-teal-500 h-3 rounded-full" style={{ width: "38%" }}></div>
              </div>
            </div>
          </div>

          {/* Gateway Status */}
          <div className="mt-6 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Gateway Status</h5>
            {[
              { name: "Chapa", status: "Connected" },
              { name: "TeleBirr", status: "Connected" },
            ].map((gw) => (
              <div key={gw.name} className="flex items-center justify-between p-3 bg-[#fdf0f9] rounded-xl">
                <span className="font-semibold text-sm text-gray-700">{gw.name}</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-xs font-bold text-emerald-600">{gw.status}</span>
                  <button className="text-xs text-[#7B2D8B] font-bold hover:underline">Configure</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex gap-2 flex-wrap">
          {["all", "paid", "pending", "failed", "refunded"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                activeTab === tab ? "bg-[#7B2D8B] text-white" : "text-gray-400 hover:bg-[#fdf0f9]"
              }`}
            >
              {tab === "all" ? "All Transactions" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fdf0f9]/50 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-6 py-5">Transaction ID</th>
                <th className="px-6 py-5">Patient</th>
                <th className="px-6 py-5">Doctor</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Gateway</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">{txn.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{txn.patient}</td>
                  <td className="px-6 py-4 text-gray-500">{txn.doctor}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{txn.amount} ETB</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${gatewayColors[txn.gateway]}`}>
                      {txn.gateway}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{txn.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[txn.status]}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-[#7B2D8B] hover:bg-purple-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">receipt</span>
                      </button>
                      {txn.status === "paid" && (
                        <button className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">currency_exchange</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-[#fdf0f9]/30 border-t border-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400 font-medium">Showing {filtered.length} transactions</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#7B2D8B] text-white font-bold text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 font-bold text-xs">2</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
