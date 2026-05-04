import { useState, useEffect } from "react";
import PatientLayout from "./components/PatientLayout";
import { getPayments, uploadReceipt, verifyChapaPayment } from "../../services/patientService";

const statusColors = {
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  awaiting_verification: "bg-purple-100 text-purple-700",
  failed: "bg-red-100 text-red-700",
};

const methodIcons = {
  chapa: "credit_card",
  receipt_upload: "payments",
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function ReceiptModal({ payment, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-br from-[#E05C8A] to-[#F4845F] p-6 text-white text-center relative">
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
          <div className="flex justify-between items-center py-3 bg-gradient-to-r from-[#fff5f7] to-rose-50 rounded-xl px-3 mt-2">
            <span className="text-sm font-black text-gray-700">
              Total Amount
            </span>
            <span className="text-xl font-black text-[#E05C8A]">
              {payment.amount} ETB
            </span>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button className="flex-1 py-2.5 bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
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
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    const res = await getPayments();
    if (res.error) {
      setError(res.error);
      setPayments([]);
    } else {
      setPayments(res.data || []);
    }
    setLoading(false);
  };

  const filtered = filter === "all" ? payments : payments.filter((p) => p.status === filter);
  const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + (p.amount || 0), 0);

  const handleVerify = async (tx_ref) => {
    setLoading(true);
    const res = await verifyChapaPayment(tx_ref);
    if (res.error) setError(res.error);
    await fetchPayments();
    setLoading(false);
  };

  const openUpload = (payment) => {
    setSelected(payment);
    setShowUpload(true);
  };

  const handleUpload = async () => {
    if (!uploadFile || !selected) return;
    setLoading(true);
    const res = await uploadReceipt(selected._id, uploadFile);
    if (res.error) setError(res.error);
    setShowUpload(false);
    setUploadFile(null);
    setSelected(null);
    await fetchPayments();
    setLoading(false);
  };

  return (
    <PatientLayout title="Billing">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-[#E05C8A] flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">payments</span>
            Billing & Payments
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {payments.length} transactions
          </p>
        </div>

        {/* Payment Account Information */}
        <div className="bg-gradient-to-r from-[#fff5f7] to-rose-50 rounded-2xl p-5 border border-rose-100">
          <h3 className="font-bold text-[#E05C8A] flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined">account_balance</span>
            Payment Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CBE */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 text-sm">account_balance</span>
                </div>
                <span className="font-bold text-sm text-gray-800">CBE</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Commercial Bank of Ethiopia</p>
              <p className="text-sm font-bold text-gray-900">1000123456789</p>
              <p className="text-xs text-gray-400 mt-1">Account Name: Tenaye Health</p>
            </div>

            {/* Telebirr */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 text-sm">smartphone</span>
                </div>
                <span className="font-bold text-sm text-gray-800">Telebirr</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Ethio Telecom</p>
              <p className="text-sm font-bold text-gray-900">+251 911 234 567</p>
              <p className="text-xs text-gray-400 mt-1">Account Name: Tenaye Health</p>
            </div>

            {/* Bank of Abyssinia */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600 text-sm">account_balance</span>
                </div>
                <span className="font-bold text-sm text-gray-800">Bank of Abyssinia</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Abyssinia Bank</p>
              <p className="text-sm font-bold text-gray-900">00212345678901</p>
              <p className="text-xs text-gray-400 mt-1">Account Name: Tenaye Health</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-amber-500">info</span>
            Please transfer to one of these accounts and upload your receipt for verification.
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
              color: "text-[#E05C8A]",
              bg: "bg-[#fff5f7]",
              border: "border-rose-100",
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
          {["all", "paid", "pending"].map((f) => (
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
              key={pay._id || pay.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-rose-200 transition-all duration-300 p-5 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fff5f7] to-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                    <span className="material-symbols-outlined text-[#E05C8A] text-xl">
                      {methodIcons[pay.gateway] || "payments"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">
                      {pay.doctor?.user?.full_name || pay.doctor?.full_name || 'Consultation'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{pay.doctor?.specialty || 'General'}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs">
                        calendar_today
                      </span>
                      {pay.createdAt ? new Date(pay.createdAt).toLocaleDateString() : 'N/A'} · via {pay.gateway}
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
                  <div className="flex items-center gap-2">
                    {pay.gateway === 'chapa' && pay.status === 'pending' && (
                      <button
                        onClick={() => handleVerify(pay.tx_ref)}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white text-sm font-bold"
                      >
                        {loading ? 'Working...' : 'Verify Payment'}
                      </button>
                    )}

                    {pay.gateway === 'receipt_upload' && pay.status === 'awaiting_verification' && (
                      <button
                        onClick={() => openUpload(pay)}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white text-sm font-bold"
                      >
                        Upload / View Receipt
                      </button>
                    )}

                    {pay.receipt_url && (
                      <a
                        href={`${API_BASE_URL}${pay.receipt_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-gradient-to-br from-[#fff5f7] to-rose-50 text-[#E05C8A] hover:from-rose-100 transition-all border border-rose-100"
                      >
                        <span className="material-symbols-outlined text-lg">receipt_long</span>
                      </a>
                    )}
                  </div>
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

      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <h3 className="font-black text-lg">Upload Receipt</h3>
              <p className="text-sm text-gray-500 mt-2">Payment: {selected?.tx_ref || selected?._id}</p>
              <div className="mt-4">
                <input type="file" accept="image/*,.pdf" onChange={(e) => setUploadFile(e.target.files[0])} />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleUpload} className="flex-1 py-2.5 bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white text-sm font-bold rounded-xl">Upload</button>
                <button onClick={() => { setShowUpload(false); setUploadFile(null); setSelected(null); }} className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
