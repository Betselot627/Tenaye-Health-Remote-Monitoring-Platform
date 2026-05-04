import { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import { getAllPayments, approvePayment, rejectPayment } from "../../services/adminService";
import { exportPayments } from "../../utils/exportUtils";

const statusColors = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  awaiting_verification: "bg-purple-100 text-purple-700",
};

const gatewayColors = {
  chapa: "bg-purple-100 text-purple-700",
  receipt_upload: "bg-teal-100 text-teal-700",
};

function Toast({ message, type, onClose }) {
  const bgColors = {
    success: "bg-emerald-600",
    error: "bg-red-600",
  };
  const icons = {
    success: "check_circle",
    error: "error",
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold
      ${bgColors[type] || "bg-blue-600"}`}>
      <span className="material-symbols-outlined text-lg">{icons[type] || "info"}</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

function RejectModal({ txn, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-red-600">cancel</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Reject Payment</h3>
        <p className="text-sm text-gray-500 mb-4">
          Reject payment of <span className="font-bold text-gray-800">{txn.amount} ETB</span> from{" "}
          <span className="font-bold text-gray-800">{txn.patient}</span>.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="w-full p-3 border border-gray-200 rounded-xl text-sm mb-4 focus:outline-none focus:border-[#7B2D8B]"
          rows={3}
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(reason)} 
            disabled={!reason.trim()}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function ReceiptViewerModal({ receiptUrl, filename, onClose }) {
  const fullUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}${receiptUrl}`;
  const isImage = /\.(jpg|jpeg|png)$/i.test(receiptUrl);
  const isPdf = /\.pdf$/i.test(receiptUrl);

  return (
    <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#7B2D8B] to-[#600f72] p-4 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined">receipt</span>
            Receipt: {filename || 'Receipt'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <span className="material-symbols-outlined text-white">close</span>
          </button>
        </div>
        <div className="p-6 bg-gray-50 flex items-center justify-center min-h-[300px]">
          {isImage ? (
            <img src={fullUrl} alt="Receipt" className="max-w-full max-h-[500px] rounded-lg shadow-lg" />
          ) : isPdf ? (
            <iframe src={fullUrl} className="w-full h-[500px] rounded-lg shadow-lg" title="Receipt PDF" />
          ) : (
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">description</span>
              <p className="text-gray-500">Unable to preview this file type</p>
              <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#7B2D8B] text-white rounded-lg hover:bg-[#600f72]">
                <span className="material-symbols-outlined">open_in_new</span>
                Open in New Tab
              </a>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <a
            href={fullUrl}
            download
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">download</span>
            Download
          </a>
          <button onClick={onClose} className="px-4 py-2 bg-[#7B2D8B] text-white rounded-lg font-semibold hover:bg-[#600f72]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState("all");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [receiptModal, setReceiptModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await getAllPayments();
      if (data) setPayments(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <AdminLayout title="Payments & Revenue">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7B2D8B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </AdminLayout>
  );

  const filtered = payments.filter((p) => activeTab === "all" || p.status === activeTab);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = async (txn) => {
    const result = await approvePayment(txn.id);
    if (!result.error) {
      setPayments(prev => prev.map(p => p.id === txn.id ? { ...p, status: "paid" } : p));
      showToast(`Payment of ${txn.amount} ETB approved for ${txn.patient}.`, "success");
    } else {
      showToast(`Failed to approve: ${result.error}`, "error");
    }
  };

  const handleReject = async (reason) => {
    const txn = rejectModal;
    const result = await rejectPayment(txn.id, reason);
    if (!result.error) {
      setPayments(prev => prev.map(p => p.id === txn.id ? { ...p, status: "failed" } : p));
      setRejectModal(null);
      showToast(`Payment of ${txn.amount} ETB rejected for ${txn.patient}.`, "error");
    } else {
      showToast(`Failed to reject: ${result.error}`, "error");
    }
  };

  return (
    <AdminLayout title="Payments & Revenue">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {rejectModal && (
        <RejectModal
          txn={rejectModal}
          onConfirm={handleReject}
          onCancel={() => setRejectModal(null)}
        />
      )}
      {receiptModal && (
        <ReceiptViewerModal
          receiptUrl={receiptModal.receipt_url}
          filename={receiptModal.receipt_filename}
          onClose={() => setReceiptModal(null)}
        />
      )}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#7B2D8B]">Payments & Revenue</h2>
          <p className="text-gray-400 mt-1">Financial overview and transaction management</p>
        </div>
        <button 
          onClick={() => exportPayments(payments)}
          className="flex items-center gap-2 px-6 py-3 bg-[#fdf0f9] text-[#7B2D8B] rounded-full font-bold hover:bg-purple-100 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#600f72] p-6 rounded-2xl text-white col-span-2 md:col-span-1">
          <span className="material-symbols-outlined mb-3 block opacity-70">payments</span>
          <p className="text-3xl font-black">
            {(payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0) / 1000).toFixed(0)}K
          </p>
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
          <p className="text-3xl font-black text-amber-600">
            {payments.filter(p => p.status === "awaiting_verification").length}
          </p>
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mt-1">Pending Verification</p>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl">
          <span className="material-symbols-outlined text-red-500 mb-3 block">error</span>
          <p className="text-3xl font-black text-red-600">{payments.filter(p => p.status === "failed").length}</p>
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
                <span className="font-bold text-[#7B2D8B]">
                  {payments.filter(p => p.gateway === 'chapa').length}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div 
                  className="bg-[#7B2D8B] h-3 rounded-full" 
                  style={{ width: payments.length ? `${(payments.filter(p => p.gateway === 'chapa').length / payments.length) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">Receipt Upload</span>
                <span className="font-bold text-teal-600">
                  {payments.filter(p => p.gateway === 'receipt_upload').length}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div 
                  className="bg-teal-500 h-3 rounded-full" 
                  style={{ width: payments.length ? `${(payments.filter(p => p.gateway === 'receipt_upload').length / payments.length) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Gateway Status */}
          <div className="mt-6 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Gateway Status</h5>
            {[
              { name: "Chapa", status: "Connected" },
              { name: "Receipt Upload", status: "Active" },
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
          {["all", "paid", "pending", "failed", "awaiting_verification"].map((tab) => (
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
                  <td className="px-6 py-4 text-gray-400">
                    {txn.created_at ? new Date(txn.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[txn.status]}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {txn.receipt_url && (
                        <button
                          onClick={() => setReceiptModal(txn)}
                          className="p-2 text-[#7B2D8B] hover:bg-purple-50 rounded-lg transition-colors"
                          title="View receipt"
                        >
                          <span className="material-symbols-outlined text-xl">receipt</span>
                        </button>
                      )}
                      {txn.status === "awaiting_verification" && (
                        <>
                          <button
                            onClick={() => handleApprove(txn)}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Approve payment"
                          >
                            <span className="material-symbols-outlined text-xl">check_circle</span>
                          </button>
                          <button
                            onClick={() => setRejectModal(txn)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject payment"
                          >
                            <span className="material-symbols-outlined text-xl">cancel</span>
                          </button>
                        </>
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
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#7B2D8B] text-white font-bold text-xs">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 font-bold text-xs">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
