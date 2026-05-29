import { useState } from "react";
import config from "../config";
import SalaryCharts from "../components/SalaryCharts";

function PredictPage() {
  const [formData, setFormData] = useState({
    job_title: "",
    experience_level: "",
    work_models: "",
    company_location: "",
    company_size: "",
  });

  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartTriggered, setChartTriggered] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSalary(null);

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Prediction failed");

      setSalary(data.predicted_salary);
      setChartTriggered((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">IT Salary Predictor</h1>
          <p className="text-gray-400 mb-6">Fill in your details to get a salary estimate</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Job Title */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Job Title</label>
              <select name="job_title" value={formData.job_title} onChange={handleChange} required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select job title</option>
                <option>Data Scientist</option>
                <option>Data Engineer</option>
                <option>Data Analyst</option>
                <option>Machine Learning Engineer</option>
                <option>AI Engineer</option>
                <option>Research Scientist</option>
                <option>Analytics Engineer</option>
                <option>Data Architect</option>
                <option>MLOps Engineer</option>
                <option>Business Intelligence Engineer</option>
                <option>Other</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Experience Level</label>
              <select name="experience_level" value={formData.experience_level} onChange={handleChange} required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select experience level</option>
                <option value="EN">Entry Level</option>
                <option value="MI">Mid Level</option>
                <option value="SE">Senior</option>
                <option value="EX">Executive</option>
              </select>
            </div>

            {/* Work Model */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Work Model</label>
              <select name="work_models" value={formData.work_models} onChange={handleChange} required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select work model</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>

            {/* Company Location */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Company Location</label>
              <select name="company_location" value={formData.company_location} onChange={handleChange} required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select region</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="South America">South America</option>
                <option value="Oceania">Oceania</option>
                <option value="Africa">Africa</option>
                <option value="Middle East">Middle East</option>
              </select>
            </div>

            {/* Company Size */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Company Size</label>
              <select name="company_size" value={formData.company_size} onChange={handleChange} required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select company size</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </select>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50">
              {loading ? "Predicting..." : "Predict Salary"}
            </button>
          </form>

          {/* Result */}
          {salary && (
            <div className="mt-6 bg-gray-700 rounded-xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-1">Estimated Annual Salary</p>
              <p className="text-4xl font-bold text-green-400">
                ${salary.toLocaleString()}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-900/40 border border-red-500 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Charts — below the form card */}
        <SalaryCharts formData={formData} triggered={chartTriggered} />

      </div>
    </div>
  );
}

export default PredictPage;