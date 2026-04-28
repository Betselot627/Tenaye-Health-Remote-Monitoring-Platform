import { useState } from "react";
import PatientLayout from "./components/PatientLayout";
import { mockVitals } from "./data/mockData";

function VitalCard({
  label,
  value,
  unit,
  icon,
  color,
  bgColor,
  status,
  statusColor,
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white shadow-sm border border-gray-100 hover:border-purple-200`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 bg-gradient-to-br from-purple-100 to-pink-100 transition-all duration-500 group-hover:scale-125" />
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}
        >
          <span className={`material-symbols-outlined text-xl ${color}`}>
            {icon}
          </span>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <h3 className="text-2xl font-black text-gray-800 mt-1">
          {value}
          <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
        </h3>
        {status && (
          <span
            className={`mt-2 inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${statusColor}`}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
}

export default function PatientVitals() {
  const [vitals] = useState(mockVitals);
  const [activeTab, setActiveTab] = useState("overview");
  const latest = vitals[0];

  const vitalCards = [
    {
      label: "Blood Pressure",
      value: latest.bp,
      unit: "mmHg",
      icon: "favorite",
      color: "text-red-500",
      bgColor: "bg-red-50",
      status: "Elevated",
      statusColor: "bg-red-100 text-red-700",
    },
    {
      label: "Heart Rate",
      value: latest.hr,
      unit: "BPM",
      icon: "monitor_heart",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      status: "Normal",
      statusColor: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "SpO₂",
      value: latest.spo2,
      unit: "%",
      icon: "air",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      status: "Normal",
      statusColor: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Temperature",
      value: latest.temp,
      unit: "°C",
      icon: "thermostat",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      status: "Normal",
      statusColor: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Weight",
      value: latest.weight,
      unit: "kg",
      icon: "scale",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      status: "Stable",
      statusColor: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <PatientLayout title="My Vitals">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#7B2D8B] flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl">
                monitor_heart
              </span>
              My Vitals
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              Last updated: {latest.date}
            </p>
          </div>
          <div className="flex gap-2">
            {["overview", "history"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === t ? "bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0] text-white shadow-lg shadow-purple-200" : "bg-white text-gray-500 border border-gray-200 hover:border-purple-300 hover:text-[#7B2D8B]"}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" ? (
          <>
            {/* Latest vitals grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {vitalCards.map((v) => (
                <VitalCard key={v.label} {...v} />
              ))}
            </div>

            {/* Heart rate chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7B2D8B]">
                      show_chart
                    </span>
                    Heart Rate Trend
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Last 7 readings
                  </p>
                </div>
                <span className="bg-gradient-to-r from-[#fdf0f9] to-purple-50 text-[#7B2D8B] text-xs font-bold px-3 py-1.5 rounded-full border border-purple-100">
                  BPM
                </span>
              </div>
              <div className="h-48 relative">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 600 160"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7B2D8B" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#7B2D8B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[40, 80, 120].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="600"
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  {/* HR values mapped: 77-88 BPM → y 20-140 */}
                  {(() => {
                    const pts = vitals.map((v, i) => {
                      const x = (i / (vitals.length - 1)) * 580 + 10;
                      const y = 160 - ((v.hr - 70) / 30) * 140;
                      return [x, y];
                    });
                    const d = pts
                      .map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`)
                      .join(" ");
                    const fill =
                      d + ` L${pts[pts.length - 1][0]},160 L${pts[0][0]},160 Z`;
                    return (
                      <>
                        <path d={fill} fill="url(#hrGrad)" />
                        <path
                          d={d}
                          fill="none"
                          stroke="#7B2D8B"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {pts.map(([cx, cy], i) => (
                          <g key={i}>
                            <circle
                              cx={cx}
                              cy={cy}
                              r="5"
                              fill="#7B2D8B"
                              className="animate-pulse"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                            <text
                              x={cx}
                              y={cy - 10}
                              textAnchor="middle"
                              fontSize="10"
                              fill="#7B2D8B"
                              fontWeight="bold"
                            >
                              {vitals[i].hr}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
              <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
                {vitals.map((v) => (
                  <span
                    key={v.date}
                    className="hover:text-[#7B2D8B] transition-colors cursor-default"
                  >
                    {v.date}
                  </span>
                ))}
              </div>
            </div>

            {/* BP chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500">
                      favorite
                    </span>
                    Blood Pressure Trend
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Systolic readings
                  </p>
                </div>
                <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full border border-red-100">
                  mmHg
                </span>
              </div>
              <div className="space-y-2">
                {vitals.map((v) => {
                  const sys = parseInt(v.bp.split("/")[0]);
                  const pct = ((sys - 120) / 60) * 100;
                  return (
                    <div key={v.date} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-14 flex-shrink-0">
                        {v.date}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${sys >= 140 ? "bg-gradient-to-r from-red-400 to-red-500" : "bg-gradient-to-r from-[#7B2D8B] to-[#9d3fb0]"}`}
                          style={{
                            width: `${Math.min(Math.max(pct, 10), 100)}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-black w-20 flex-shrink-0 ${sys >= 140 ? "text-red-600" : "text-gray-700"}`}
                      >
                        {v.bp}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* History table */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7B2D8B]">
                  history
                </span>
                Vitals History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#fdf0f9]/50">
                    {[
                      "Date",
                      "Blood Pressure",
                      "Heart Rate",
                      "SpO₂",
                      "Temperature",
                      "Weight",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {vitals.map((v, i) => (
                    <tr
                      key={v.date}
                      className={`hover:bg-[#fdf0f9]/30 transition-colors ${i === 0 ? "bg-purple-50/30" : ""}`}
                    >
                      <td className="px-4 py-3 font-bold text-gray-800">
                        {v.date}
                        {i === 0 && (
                          <span className="ml-2 text-xs bg-[#7B2D8B] text-white px-1.5 py-0.5 rounded-full">
                            Latest
                          </span>
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 font-semibold ${parseInt(v.bp) >= 140 ? "text-red-600" : "text-gray-700"}`}
                      >
                        {v.bp} mmHg
                      </td>
                      <td className="px-4 py-3 text-gray-700">{v.hr} BPM</td>
                      <td className="px-4 py-3 text-gray-700">{v.spo2}%</td>
                      <td className="px-4 py-3 text-gray-700">{v.temp}°C</td>
                      <td className="px-4 py-3 text-gray-700">{v.weight} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
