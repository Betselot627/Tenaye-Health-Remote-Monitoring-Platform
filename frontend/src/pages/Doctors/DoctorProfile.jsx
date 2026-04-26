import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PatientLayout from "../../components/layout/PatientLayout";

const mockDoctors = {
  1: {
    _id: "1",
    user: { full_name: "Dr. Amanuel Tesfaye", email: "amanuel@rphms.et" },
    specialty: "Cardiology",
    subSpecialty: "Interventional Cardiology",
    rating: 4.8,
    totalReviews: 312,
    years_experience: 10,
    consultation_fee: 500,
    bio: "Experienced cardiologist specializing in interventional procedures and heart failure management. Committed to evidence-based, patient-centered care.",
    hospital: "Black Lion Specialized Hospital",
    education: "MD, Addis Ababa University · Fellowship, Cardiology",
    languages: ["Amharic", "English"],
    availability: [
      { day: "Monday", slots: ["09:00 AM", "10:00 AM", "02:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "03:00 PM"] },
      { day: "Friday", slots: ["09:00 AM", "11:00 AM"] },
    ],
    is_verified: true,
  },
  2: {
    _id: "2",
    user: { full_name: "Dr. Meron Alemu", email: "meron@rphms.et" },
    specialty: "Pediatrics",
    subSpecialty: "Neonatology",
    rating: 4.7,
    totalReviews: 198,
    years_experience: 8,
    consultation_fee: 400,
    bio: "Dedicated pediatrician with a focus on child development, immunization, and preventive care for infants and children.",
    hospital: "Tikur Anbessa Hospital",
    education: "MD, Jimma University · Residency, Pediatrics",
    languages: ["Amharic", "English", "Oromiffa"],
    availability: [
      { day: "Tuesday", slots: ["09:00 AM", "11:00 AM"] },
      { day: "Thursday", slots: ["10:00 AM", "02:00 PM"] },
    ],
    is_verified: true,
  },
  3: {
    _id: "3",
    user: { full_name: "Dr. Dawit Bekele", email: "dawit@rphms.et" },
    specialty: "Neurology",
    subSpecialty: "Epilepsy & Movement Disorders",
    rating: 4.9,
    totalReviews: 421,
    years_experience: 15,
    consultation_fee: 600,
    bio: "Neurologist with 15 years of experience in epilepsy, stroke management, and movement disorders.",
    hospital: "St. Paul's Hospital",
    education: "MD, Addis Ababa University · Fellowship, Neurology, Germany",
    languages: ["Amharic", "English", "German"],
    availability: [
      { day: "Monday", slots: ["10:00 AM", "02:00 PM"] },
      { day: "Friday", slots: ["09:00 AM"] },
    ],
    is_verified: true,
  },
};

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const doc = mockDoctors[id] ?? Object.values(mockDoctors)[0];
      setDoctor(doc);
      setActiveDay(doc.availability[0]?.day ?? null);
      setLoading(false);
    }, 400);
  }, [id]);

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
  const daySlots =
    doctor.availability.find((a) => a.day === activeDay)?.slots ?? [];

  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        {/* Back */}
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#632a7e] mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back to Doctors
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left — profile card */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center text-[#632a7e] font-black text-2xl mx-auto mb-4">
                {initials}
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <h1 className="font-black text-gray-800 text-lg">
                  {doctor.user.full_name}
                </h1>
                {doctor.is_verified && (
                  <span className="material-symbols-outlined text-[#632a7e] text-base">
                    verified
                  </span>
                )}
              </div>
              <p className="text-sm text-[#632a7e] font-semibold">
                {doctor.specialty}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {doctor.subSpecialty}
              </p>

              <div className="flex justify-center gap-4 mt-4 text-center">
                <div>
                  <p className="font-black text-gray-800">{doctor.rating}</p>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
                <div className="w-px bg-gray-100" />
                <div>
                  <p className="font-black text-gray-800">
                    {doctor.years_experience}y
                  </p>
                  <p className="text-xs text-gray-400">Experience</p>
                </div>
                <div className="w-px bg-gray-100" />
                <div>
                  <p className="font-black text-gray-800">
                    {doctor.totalReviews}
                  </p>
                  <p className="text-xs text-gray-400">Reviews</p>
                </div>
              </div>

              <Link
                to={`/appointments/book/${doctor._id}`}
                className="mt-5 block w-full py-3 bg-[#632a7e] text-white rounded-xl font-bold text-sm hover:bg-purple-900 transition-colors text-center"
              >
                Book Appointment
              </Link>
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              {[
                {
                  icon: "local_hospital",
                  label: "Hospital",
                  value: doctor.hospital,
                },
                { icon: "school", label: "Education", value: doctor.education },
                {
                  icon: "translate",
                  label: "Languages",
                  value: doctor.languages.join(", "),
                },
                {
                  icon: "payments",
                  label: "Fee",
                  value: `${doctor.consultation_fee} ETB`,
                },
                { icon: "mail", label: "Email", value: doctor.user.email },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#632a7e] text-base mt-0.5 shrink-0">
                    {icon}
                  </span>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — bio + availability */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-3">About</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {doctor.bio}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Available Slots</h2>
              <div className="flex gap-2 flex-wrap mb-4">
                {doctor.availability.map((a) => (
                  <button
                    key={a.day}
                    onClick={() => setActiveDay(a.day)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      activeDay === a.day
                        ? "bg-[#632a7e] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {a.day}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((slot) => (
                  <span
                    key={slot}
                    className="px-4 py-2 bg-purple-50 text-[#632a7e] rounded-xl text-xs font-semibold"
                  >
                    {slot}
                  </span>
                ))}
                {daySlots.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No slots available this day.
                  </p>
                )}
              </div>
              <Link
                to={`/appointments/book/${doctor._id}`}
                className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-[#632a7e] text-white rounded-xl font-bold text-sm hover:bg-purple-900 transition-colors"
              >
                <span className="material-symbols-outlined text-base">
                  calendar_today
                </span>
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
