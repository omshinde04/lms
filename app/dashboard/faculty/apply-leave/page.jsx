"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ApplyLeavePage() {
  const [form, setForm] = useState({
    name: "",
    department: "",
    type: "Casual",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  // ✅ Fetch faculty requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/faculty/apply-leave", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        }
      } catch (err) {
        console.error("Error fetching faculty leave requests:", err);
      }
    };
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/faculty/apply-leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("✅ Leave applied successfully!");
        setForm({
          name: "",
          department: "",
          type: "Casual",
          fromDate: "",
          toDate: "",
          reason: "",
        });
        // 🔄 Refresh requests list
        const updated = await res.json();
        setRequests((prev) => [updated, ...prev]);
      } else {
        const data = await res.json();
        alert(`❌ Failed: ${data.error}`);
      }
    } catch (err) {
      console.error("Error applying leave:", err);
      alert("⚠️ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 py-16">
      <motion.div
        className="w-full max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-8 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-[#ffd200] text-center mb-6">
          📝 Apply for Leave
        </h1>

        {/* Leave Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-10">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
            required
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
            required
          >
            <option value="Casual">Casual Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Maternity">Maternity Leave</option>
            <option value="Other">Other</option>
          </select>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              className="flex-1 p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
              required
            />
            <input
              type="date"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
              className="flex-1 p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
              required
            />
          </div>

          <textarea
            name="reason"
            placeholder="Reason for Leave"
            value={form.reason}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
            rows={4}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffd200] hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition transform hover:scale-105"
          >
            {loading ? "Submitting..." : "✅ Submit Leave Request"}
          </button>
        </form>

        {/* My Leave Requests */}
        <h2 className="text-2xl font-semibold text-[#ffd200] mb-4">
          📋 My Leave Requests
        </h2>
        {requests.length === 0 ? (
          <p className="text-gray-400">No leave requests yet.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="p-4 rounded-lg bg-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p className="font-semibold">{req.type} Leave</p>
                  <p className="font-semibold">{req.name} </p>
                    <p className="font-semibold">{req.department} </p>
                  <p className="text-sm text-gray-400">
                    {new Date(req.fromDate).toLocaleDateString()} ➝{" "}
                    {new Date(req.toDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-300">Reason: {req.reason}</p>
                </div>
                <span
                  className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-bold ${
                    req.status === "Pending"
                      ? "bg-yellow-500 text-black"
                      : req.status === "Approved"
                      ? "bg-green-500 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
