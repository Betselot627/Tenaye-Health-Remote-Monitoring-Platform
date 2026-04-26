import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PatientLayout from "../../components/layout/PatientLayout";

const mockDoctors = {
  1: {
    _id: "1",
    user: { full_name: "Dr. Amanuel Tesfaye" },
    specialty: "Cardiology",
    consultation_fee: 500,
    availability: [
      { day: "Monday", slots: ["09:00 AM", "10:00 AM", "02:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "03:00 PM"] },
      { day: "Friday", slots: ["09:00 AM", "11:00 AM"] },
    ],
  },
  2: {
    _id: "2",
    user: { full_name: "Dr. Meron Alemu" },
    specialty: "Pediatrics",
    consultation_fee: 400,
    availability: [
      { day: "Tuesday", slots: ["09:00 AM", "11:00 AM"] },
      { day: "Thursday", slots: ["10:00 AM", "02:00 PM"] },
    ],
  },
  3: {
    _id: "3",
    user: { full_name: "Dr. Dawit Bekele" },
    specialty: "Neurology",
    consultation_fee: 600,
    availability: [
      { day: "Monday", slots: ["10:00 AM", "02:00 PM"] },
      { day: "Friday", slots: ["09:00 AM"] },
    ],
  },
};

function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-100 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
    >
      <span className="material-symbols-outlined text-lg">
        {type === "success" ? "check_circle" : "cancel"}
      </span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const doc = mockDoctors[doctorId] ?? Object.values(mockDoctors)[0];
      setDoctor(doc);
      setSelectedDay(doc.availability[0]?.day ?? null);
      setLoading(false);
    }, 300);
  }, [doctorId]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBook = async () => {
    if (!selectedSlot) {
      showToast("Please select a time slot", "error");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    showToast("Appointment booked successfully!");
    setSubmitting(false);
    setTimeout(() => navigate("/appointments"), 1500);
  };

  const daySlots =
    doctor?.availability.find((a) => a.day === selectedDay)?.slots ?? [];

  if (loading)
    return (
      <PatientLayout>
        <div className="flex justify-center py-32">
          <div className="w-8 h-8 border-4 border-[#632a7e] border-t-transparent rounded-full animate-spin" />
        </div>
      </PatientLayout>
    );

  const initials = doctor.user.full_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <PatientLayout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-2xl mx-auto px-6 md:px-8 py-10">
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#632a7e] mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back to Doctors
        </Link>

        <h1 className="text-2xl font-black text-gray-800 mb-6">
          Book Appointment
        </h1>

        {/* Doctor summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-[#632a7e] font-black text-lg shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-bold text-gray-800">{doctor.user.full_name}</p>
            <p className="text-sm text-[#632a7e] font-semibold">
              {doctor.specialty}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Consultation fee: {doctor.consultation_fee} ETB
            </p>
          </div>
        </div>

        {/* Day picker */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-4">Select Day</h2>
          <div className="flex gap-2 flex-wrap">
            {doctor.availability.map((a) => (
              <button
                key={a.day}
                onClick={() => {
                  setSelectedDay(a.day);
                  setSelectedSlot(null);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  selectedDay === a.day
                    ? "bg-[#632a7e] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {a.day}
              </button>
            ))}
          </div>
        </div>

        {/* Slot picker */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-4">Select Time Slot</h2>
          <div className="flex flex-wrap gap-2">
            {daySlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedSlot === slot
                    ? "bg-[#632a7e] text-white shadow-sm"
                    : "bg-purple-50 text-[#632a7e] hover:bg-purple-100"
                }`}
              >
                {slot}
              </button>
            ))}
            {daySlots.length === 0 && (
              <p className="text-sm text-gray-400">No slots for this day.</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-3">Notes (optional)</h2>
          <textarea
            rows={3}
            placeholder="Describe your symptoms or reason for visit..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#632a7e]/20 resize-none"
          />
        </div>

        {/* Summary + confirm */}
        {selectedSlot && (
          <div className="bg-purple-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#632a7e]">
              event
            </span>
            <p className="text-sm font-semibold text-gray-700">
              {selectedDay} at {selectedSlot} with {doctor.user.full_name}
            </p>
          </div>
        )}

        <button
          onClick={handleBook}
          disabled={submitting}
          className="w-full py-4 bg-[#632a7e] text-white rounded-xl font-bold text-sm hover:bg-purple-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {submitting
            ? "Booking..."
            : `Confirm Booking — ${doctor.consultation_fee} ETB`}
        </button>
      </div>
    </PatientLayout>
  );
}
