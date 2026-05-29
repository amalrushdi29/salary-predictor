import { useState, useEffect } from "react";
import config from "../config";

const EXPERIENCE_LEVELS = [
  { label: "Entry",  value: "EN" },
  { label: "Mid",    value: "MI" },
  { label: "Senior", value: "SE" },
  { label: "Exec",   value: "EX" },
];

const REGIONS = [
  "North America", "Europe", "Asia",
  "South America", "Oceania", "Africa", "Middle East"
];

const COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-cyan-500",
  "bg-emerald-500", "bg-amber-500", "bg-red-500", "bg-pink-500"
];

function BarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.salary));

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">{item.name}</span>
            <span className="text-white font-medium">${item.salary.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`${color || COLORS[i]} h-3 rounded-full transition-all duration-700`}
              style={{ width: `${(item.salary / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SalaryCharts({ formData, triggered }) {
  const [experienceData, setExperienceData] = useState([]);
  const [regionData, setRegionData]         = useState([]);
  const [loading, setLoading]               = useState(false);

  useEffect(() => {
    if (!triggered) return;
    fetchChartData();
  }, [triggered]);

  const fetchChartData = async () => {
    setLoading(true);

    try {
      const expResults = await Promise.all(
        EXPERIENCE_LEVELS.map((exp) =>
          fetch(`${config.BACKEND_URL}/api/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, experience_level: exp.value }),
          }).then((r) => r.json())
        )
      );

      setExperienceData(
        expResults.map((res, i) => ({
          name:   EXPERIENCE_LEVELS[i].label,
          salary: Math.round(res.predicted_salary),
        }))
      );

      const regionResults = await Promise.all(
        REGIONS.map((region) =>
          fetch(`${config.BACKEND_URL}/api/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, company_location: region }),
          }).then((r) => r.json())
        )
      );

      setRegionData(
        regionResults.map((res, i) => ({
          name:   REGIONS[i],
          salary: Math.round(res.predicted_salary),
        }))
      );

    } catch (err) {
      console.error("Chart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!triggered) return null;

  if (loading) return (
    <div className="mt-8 text-center text-gray-400 animate-pulse">
      Loading charts...
    </div>
  );

  return (
    <div className="mt-8 space-y-6">

      {/* Chart 1 — Experience Level */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-lg mb-1">
          Salary by Experience Level
        </h2>
        <p className="text-gray-400 text-sm mb-5">
          {formData.job_title} · {formData.work_models} · {formData.company_size === "S" ? "Small" : formData.company_size === "M" ? "Medium" : "Large"} company
        </p>
        <BarChart data={experienceData} />
      </div>

      {/* Chart 2 — Region */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-lg mb-1">
          Salary by Region
        </h2>
        <p className="text-gray-400 text-sm mb-5">
          {formData.job_title} · {formData.work_models} · {formData.experience_level} experience
        </p>
        <BarChart data={regionData} />
      </div>

    </div>
  );
}

export default SalaryCharts;