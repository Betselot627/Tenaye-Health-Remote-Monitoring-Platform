import { useState, useEffect } from "react";
import DoctorLayout from "./components/DoctorLayout";
import { mockSchedule } from "./data/mockData";

const ALL_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

function Toast({ message, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold bg-emerald-600">
      <span className="material-symbols-outlined text-lg">check_circle</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

export default function DoctorSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      // Ensure all 5 days are present
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const filled = days.map(
        (day) => mockSchedule.find((s) => s.day === day) ?? { day, slots: [] },
      );
      setSchedule(filled);
      setLoading(false);
    }, 400);
  }, []);

  const toggleSlot = (dayIndex, slot) => {
    setSchedule((prev) =>
      prev.map((d, i) => {
        if (i !== dayIndex) return d;
        const has = d.slots.includes(slot);
        return {
          ...d,
          slots: has ? d.slots.filter((s) => s !== slot) : [...d.slots, slot],
        };
      }),
    );
  };

  const handleSave = () => {
    setToast("Schedule saved successfully");
    setTimeout(() => setToast(null), 3000);
  };

  if (loading)
    return (
      <DoctorLayout title="My Schedule">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#0D7377] border-t-transparent rounded-full animate-spin" />
        </div>
      </DoctorLayout>
    );

  return (
    <DoctorLayout title="My Schedule">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Weekly Availability
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Toggle slots to set your available hours
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0D7377] text-white rounded-xl font-bold text-sm hover:bg-[#0a5c60] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            Save Schedule
          </button>
        </div>

        <div className="space-y-6">
          {schedule.map((day, dayIndex) => (
            <div key={day.day}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-bold text-gray-700 w-24">
                  {day.day}
                </span>
                <span className="text-xs text-gray-400">
                  {day.slots.length} slot{day.slots.length !== 1 ? "s" : ""}{" "}
                  selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_SLOTS.map((slot) => {
                  const active = day.slots.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(dayIndex, slot)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        active
                          ? "bg-[#0D7377] text-white shadow-sm"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}
