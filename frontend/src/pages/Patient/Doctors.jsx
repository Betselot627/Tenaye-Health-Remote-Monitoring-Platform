import { useState } from "react";
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

function DoctorModal({ doctor, onClose }) {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [booked, setBooked] = useState(false);

  const times = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleBook = () => {
    if (!selectedDate || !selectedTime) return;
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      onClose();
    }, 2000);
  };

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
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">
                person
              </span>
            </div>
            <div>
              <h3 className="font-black text-xl">{doctor.name}</h3>
              <p className="text-white/80 text-sm">
                {doctor.specialty} · {doctor.subSpecialty}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`material-symbols-outlined text-sm ${i < Math.floor(doctor.rating) ? "text-yellow-300" : "text-white/30"}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-white/80 text-xs">
                  {doctor.rating} ({doctor.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {booked ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-emerald-600 text-3xl">
                  check_circle
                </span>
              </div>
              <p className="font-black text-gray-800 text-lg">
                Appointment Booked!
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {selectedDate} at {selectedTime}
              </p>
            </div>
          ) : !showBooking ? (
            <>
              <p className="text-sm text-gray-600 leading-relaxed">
                {doctor.bio}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: "work_history",
                    label: "Experience",
                    value: doctor.experience,
                  },
                  {
                    icon: "payments",
                    label: "Consultation Fee",
                    value: `${doctor.fee} ETB`,
                  },
                  {
                    icon: "local_hospital",
                    label: "Hospital",
                    value: doctor.hospital,
                  },
                  {
                    icon: "schedule",
                    label: "Availability",
                    value: doctor.availability,
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
          ) : (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800">Select Date & Time</h4>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B2D8B] focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
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
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
                <span className="font-bold">Fee: {doctor.fee} ETB</span> ·
                Payment collected at appointment
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 flex-shrink-0">
          {!showBooking ? (
            <>
              <button
                onClick={() => setShowBooking(true)}
                disabled={doctor.status === "busy"}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {doctor.status === "busy"
                  ? "Currently Busy"
                  : "Book Appointment"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setShowBooking(false)}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-all"
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
          <p className="text-gray-400 text-sm mt-0.5">
            {filtered.length} doctors available
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialty..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B2D8B] focus:ring-2 focus:ring-purple-100 bg-white"
            />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7B2D8B] bg-white text-gray-700 font-semibold"
          >
            {specialties.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Doctor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-5 group"
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
                      <p className="text-sm font-black text-gray-800">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500">{doc.specialty}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColors[doc.status]}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-xs ${i < Math.floor(doc.rating) ? "text-yellow-400" : "text-gray-200"}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                      {doc.rating} ({doc.totalReviews})
                    </span>
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
                className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white text-xs font-bold rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-purple-200"
              >
                View Profile & Book
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <span className="material-symbols-outlined text-5xl text-gray-200">
              medical_services
            </span>
            <p className="text-gray-400 mt-3">
              No doctors found matching your search
            </p>
          </div>
        )}
      </div>

      {selected && (
        <DoctorModal doctor={selected} onClose={() => setSelected(null)} />
      )}
    </PatientLayout>
  );
}
