import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "./components/PatientLayout";
import { mockDoctors } from "./data/mockData";

const specialties = [
  "All",
  "Cardiology",
  "General Practice",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
];

const statusColors = {
  available: "bg-emerald-100 text-emerald-700",
  busy: "bg-amber-100 text-amber-700",
};

// ─── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step }) {
  const steps = ["Profile", "Schedule", "Payment"];
  return (
    <div className="flex items-center gap-1 mt-4">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = step === num;
        const done = step > num;
        return (
          <div key={label} className="flex items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all
                ${done ? "bg-emerald-500 text-white" : active ? "bg-white text-[#7B2D8B]" : "bg-white/30 text-white/60"}`}
            >
              {done ? (
                <span className="material-symbols-outlined text-xs">check</span>
              ) : (
                num
              )}
            </div>
            <span
              className={`text-[10px] font-bold transition-all ${active ? "text-white" : done ? "text-emerald-300" : "text-white/50"}`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`w-6 h-px mx-1 ${done ? "bg-emerald-400" : "bg-white/20"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Doctor booking modal ──────────────────────────────────────────────────────
function DoctorModal({ doctor, onClose }) {
  // step: 1 = profile, 2 = date/time, 3 = payment, 4 = success
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  const times = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "02:00 PM", "03:00 PM", "04:00 PM",
  ];

  // Simulate payment processing → redirect to success page
  const handlePay = () => {
    if (!paymentMethod) return;
    setPaying(true);
    // In production: call backend to initiate Chapa/TeleBirr, get redirect URL
    // For now: simulate 1.5s processing then navigate to success page
    setTimeout(() => {
      setPaying(false);
      onClose();
      navigate("/payment/success", {
        state: {
          doctor: doctor.name,
          specialty: doctor.specialty,
          date: selectedDate,
          time: selectedTime,
          amount: doctor.fee,
          method: paymentMethod,
          receipt: `RCP-${Date.now()}`,
        },
      });
    }, 1500);
  };

  // Today's date string for min date on input
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#7B2D8B] to-[#9d3fb0] p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <span className="material-symbols-outlined text-white text-lg">
              close
            </span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-3xl">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-xl truncate">{doctor.name}</h3>
              <p className="text-white/80 text-sm">{doctor.specialty} · {doctor.subSpecialty}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`material-symbols-outlined text-xs ${i < Math.floor(doctor.rating) ? "text-yellow-300" : "text-white/30"}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >star</span>
                ))}
                <span className="text-white/70 text-xs ml-1">{doctor.rating} ({doctor.totalReviews})</span>
              </div>
            </div>
          </div>
          {step < 4 && <StepIndicator step={step} />}
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {/* STEP 1 — Doctor profile */}
          {step === 1 && (
            <>
              <p className="text-sm text-gray-600 leading-relaxed">{doctor.bio}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "work_history", label: "Experience", value: doctor.experience },
                  { icon: "payments", label: "Consultation Fee", value: `${doctor.fee} ETB` },
                  { icon: "local_hospital", label: "Hospital", value: doctor.hospital },
                  { icon: "schedule", label: "Availability", value: doctor.availability },
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
              <div className="p-3 bg-[#fdf0f9]/40 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Languages</p>
                <div className="flex gap-2 flex-wrap">
                  {doctor.languages.map((l) => (
                    <span
                      key={l}
                      className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-[#7B2D8B] rounded-full"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 2 — Date & time */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B2D8B] focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {times.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${selectedTime === t ? "bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white border-transparent shadow-lg" : "border-gray-200 text-gray-600 hover:border-purple-300 hover:text-[#7B2D8B]"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {selectedDate && selectedTime && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">event_available</span>
                  <p className="text-sm font-semibold text-emerald-700">
                    {selectedDate} at {selectedTime}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 — Payment */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Appointment summary */}
              <div className="bg-[#fdf0f9] rounded-2xl p-4 border border-purple-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Appointment Summary</p>
                <div className="space-y-2">
                  {[
                    { icon: "person", label: "Doctor", value: doctor.name },
                    { icon: "stethoscope", label: "Specialty", value: doctor.specialty },
                    { icon: "calendar_today", label: "Date", value: selectedDate },
                    { icon: "schedule", label: "Time", value: selectedTime },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <span className="material-symbols-outlined text-sm text-[#7B2D8B]">{icon}</span>
                        {label}
                      </div>
                      <span className="text-xs font-bold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-purple-100 flex items-center justify-between">
                  <span className="text-sm font-black text-gray-700">Total Amount</span>
                  <span className="text-2xl font-black text-[#7B2D8B]">{doctor.fee} ETB</span>
                </div>
              </div>

              {/* Payment method selection */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Choose Payment Method</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Chapa */}
                  <button
                    onClick={() => setPaymentMethod("Chapa")}
                    className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                      paymentMethod === "Chapa"
                        ? "border-[#7B2D8B] bg-[#fdf0f9] shadow-lg shadow-purple-100"
                        : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"
                    }`}
                  >
                    {paymentMethod === "Chapa" && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-[#7B2D8B] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xs">check</span>
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-green-600 text-xl">credit_card</span>
                    </div>
                    <p className="text-sm font-black text-gray-800">Chapa</p>
                    <p className="text-xs text-gray-400 mt-0.5">Card / Bank Transfer</p>
                  </button>

                  {/* TeleBirr */}
                  <button
                    onClick={() => setPaymentMethod("TeleBirr")}
                    className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                      paymentMethod === "TeleBirr"
                        ? "border-[#7B2D8B] bg-[#fdf0f9] shadow-lg shadow-purple-100"
                        : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"
                    }`}
                  >
                    {paymentMethod === "TeleBirr" && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-[#7B2D8B] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xs">check</span>
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-blue-600 text-xl">phone_android</span>
                    </div>
                    <p className="text-sm font-black text-gray-800">TeleBirr</p>
                    <p className="text-xs text-gray-400 mt-0.5">Mobile Money</p>
                  </button>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="material-symbols-outlined text-sm text-emerald-500">lock</span>
                Payments are processed securely. Your card details are never stored.
              </div>
            </div>
          )}
        </div>

        {/* ── Footer buttons ── */}
        <div className="p-6 border-t border-gray-100 flex gap-3 flex-shrink-0">
          {step === 1 && (
            <>
              <button
                onClick={() => setStep(2)}
                disabled={doctor.status === "busy"}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {doctor.status === "busy" ? "Currently Busy" : (
                  <>
                    Book Appointment
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Close
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Continue to Payment
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Back
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button
                onClick={handlePay}
                disabled={!paymentMethod || paying}
                className="flex-1 py-3 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {paying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">payments</span>
                    Pay {doctor.fee} ETB
                  </>
                )}
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={paying}
                className="px-4 py-3 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PatientDoctors() {
  const [doctors] = useState(mockDoctors);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === "All" || d.specialty === specialty;
    return matchSearch && matchSpecialty;
  });

  return (
    <PatientLayout title="Find Doctors">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-[#7B2D8B] flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">
              medical_services
            </span>
            Find Doctors
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">{filtered.length} doctors available</p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialty..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E05C8A] focus:ring-2 focus:ring-rose-100 bg-white"
            />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E05C8A] bg-white text-gray-700 font-semibold"
          >
            {specialties.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Doctor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-rose-200 transition-all duration-300 p-5 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fdf0f9] to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                  <span className="material-symbols-outlined text-[#7B2D8B] text-2xl">
                    person
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-black text-gray-800">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.specialty}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColors[doc.status]}`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-xs ${i < Math.floor(doc.rating) ? "text-yellow-400" : "text-gray-200"}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >star</span>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">{doc.rating} ({doc.totalReviews})</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="material-symbols-outlined text-sm text-[#7B2D8B]">
                    work_history
                  </span>
                  {doc.experience}
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="material-symbols-outlined text-sm text-[#7B2D8B]">
                    payments
                  </span>
                  {doc.fee} ETB
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 col-span-2 truncate">
                  <span className="material-symbols-outlined text-sm text-[#7B2D8B]">
                    local_hospital
                  </span>
                  <span className="truncate">{doc.hospital}</span>
                </div>
              </div>

              <button
                onClick={() => setSelected(doc)}
                className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#E05C8A] to-[#F4845F] text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-rose-200"
              >
                View Profile & Book
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <span className="material-symbols-outlined text-5xl text-gray-200">medical_services</span>
            <p className="text-gray-400 mt-3">No doctors found matching your search</p>
          </div>
        )}
      </div>

      {selected && (
        <DoctorModal doctor={selected} onClose={() => setSelected(null)} />
      )}
    </PatientLayout>
  );
}
