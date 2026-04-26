import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PatientLayout from "../../components/layout/PatientLayout";

const mockDoctors = [
  {
    _id: "1",
    user: { full_name: "Dr. Amanuel Tesfaye" },
    specialty: "Cardiology",
    rating: 4.8,
    years_experience: 10,
    consultation_fee: 500,
    bio: "Expert in interventional cardiology and heart failure management.",
    is_verified: true,
  },
  {
    _id: "2",
    user: { full_name: "Dr. Meron Alemu" },
    specialty: "Pediatrics",
    rating: 4.7,
    years_experience: 8,
    consultation_fee: 400,
    bio: "Dedicated pediatrician with a focus on child development and preventive care.",
    is_verified: true,
  },
  {
    _id: "3",
    user: { full_name: "Dr. Dawit Bekele" },
    specialty: "Neurology",
    rating: 4.9,
    years_experience: 15,
    consultation_fee: 600,
    bio: "Neurologist specializing in epilepsy, stroke, and movement disorders.",
    is_verified: true,
  },
  {
    _id: "4",
    user: { full_name: "Dr. Hiwot Girma" },
    specialty: "Dermatology",
    rating: 4.6,
    years_experience: 6,
    consultation_fee: 450,
    bio: "Skin specialist with expertise in acne, eczema, and cosmetic dermatology.",
    is_verified: true,
  },
  {
    _id: "5",
    user: { full_name: "Dr. Yohannes Tadesse" },
    specialty: "Orthopedics",
    rating: 4.5,
    years_experience: 12,
    consultation_fee: 550,
    bio: "Orthopedic surgeon focused on sports injuries and joint replacement.",
    is_verified: true,
  },
  {
    _id: "6",
    user: { full_name: "Dr. Selamawit Haile" },
    specialty: "Psychiatry",
    rating: 4.8,
    years_experience: 9,
    consultation_fee: 500,
    bio: "Psychiatrist specializing in anxiety, depression, and trauma-informed care.",
    is_verified: true,
  },
];

const specialties = [
  "All",
  "Cardiology",
  "Pediatrics",
  "Neurology",
  "Dermatology",
  "Orthopedics",
  "Psychiatry",
];

function DoctorCard({ doctor }) {
  const initials = doctor.user.full_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-[#632a7e] font-black text-lg shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-800 text-sm">
              {doctor.user.full_name}
            </h3>
            {doctor.is_verified && (
              <span className="material-symbols-outlined text-[#632a7e] text-base">
                verified
              </span>
            )}
          </div>
          <p className="text-xs text-[#632a7e] font-semibold mt-0.5">
            {doctor.specialty}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
            <span className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-yellow-400 text-sm">
                star
              </span>
              {doctor.rating}
            </span>
            <span>{doctor.years_experience} yrs exp</span>
            <span>{doctor.consultation_fee} ETB</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {doctor.bio}
      </p>
      <div className="flex gap-2 mt-auto">
        <Link
          to={`/doctors/${doctor._id}`}
          className="flex-1 py-2.5 text-center text-xs font-bold text-[#632a7e] bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
        >
          View Profile
        </Link>
        <Link
          to={`/appointments/book/${doctor._id}`}
          className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-[#632a7e] rounded-xl hover:bg-purple-900 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}

export default function DoctorSearch() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");

  useEffect(() => {
    setTimeout(() => {
      setDoctors(mockDoctors);
      setLoading(false);
    }, 400);
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpec = specialty === "All" || d.specialty === specialty;
    return matchSearch && matchSpec;
  });

  return (
    <PatientLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800">Find a Doctor</h1>
          <p className="text-gray-400 mt-1">
            Browse verified specialists and book a consultation
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#632a7e]/20"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {specialties.map((s) => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  specialty === s
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
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#632a7e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((d) => (
                <DoctorCard key={d._id} doctor={d} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">
                  search_off
                </span>
                No doctors found matching your search.
              </div>
            )}
          </>
        )}
      </div>
    </PatientLayout>
  );
}
