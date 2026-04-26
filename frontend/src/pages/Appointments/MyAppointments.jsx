import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PatientLayout from "../../components/layout/PatientLayout";

const mockAppointments = [
  {
    _id: "1",
    doctor: {
      user: { full_name: "Dr. Amanuel Tesfaye" },
      specialty: "Cardiology",
    },
    scheduled_at: "2025-04-28T10:00:00",
    status: "upcoming",
    notes: "Follow-up for hypertension",
  },
  {
    _id: "2",
    doctor: { user: { full_name: "Dr. Meron Alemu" }, specialty: "Pediatrics" },
    scheduled_at: "2025-04-24T11:30:00",
    status: "completed",
    notes: "Child vaccination",
  },
  {
    _id: "3",
    doctor: { user: { full_name: "Dr. Dawit Bekele" }, specialty: "Neurology" },
    scheduled_at: "2025-04-20T14:00:00",
    status: "cancelled",
    notes: "",
  },
  {
    _id: "4",
    doctor: {
      user: { full_name: "Dr. Hiwot Girma" },
      specialty: "Dermatology",
    },
    scheduled_at: "2025-05-02T09:00:00",
    status: "upcoming",
    notes: "Skin rash consultation",
  },
];

const statusColors = {
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
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

export default function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 400);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCancel = (id) => {
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a)),
    );
    showToast("Appointment cancelled");
  };

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <PatientLayout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800">
              My Appointments
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your upcoming and past consultations
            </p>
          </div>
          <Link
            to="/doctors"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#632a7e] text-white rounded-xl font-bold text-sm hover:bg-purple-900 transition-colors"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Book New
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "upcoming", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                filter === s
                  ? "bg-[#632a7e] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#632a7e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((apt) => {
              const initials = apt.doctor.user.full_name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("");
              return (
                <div
                  key={apt._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-[#632a7e] font-black shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-800">
                        {apt.doctor.user.full_name}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[apt.status]}`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#632a7e] font-semibold">
                      {apt.doctor.specialty}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          calendar_today
                        </span>
                        {formatDate(apt.scheduled_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          schedule
                        </span>
                        {formatTime(apt.scheduled_at)}
                      </span>
                    </div>
                    {apt.notes && (
                      <p className="text-xs text-gray-400 mt-1 italic">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {apt.status === "upcoming" && (
                      <>
                        <button
                          onClick={() =>
                            navigate(`/consultation/room-${apt._id}`)
                          }
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#632a7e] text-white rounded-xl text-xs font-bold hover:bg-purple-900 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">
                            videocam
                          </span>
                          Join
                        </button>
                        <button
                          onClick={() => handleCancel(apt._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {apt.status === "completed" && (
                      <Link
                        to="/doctors"
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                      >
                        Rebook
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">
                  calendar_today
                </span>
                No {filter !== "all" ? filter : ""} appointments found.
                <div className="mt-4">
                  <Link
                    to="/doctors"
                    className="text-[#632a7e] font-semibold text-sm hover:underline"
                  >
                    Book your first appointment →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
