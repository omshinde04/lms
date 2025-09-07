"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ExamLeavePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    year: "",
    department: "",
    teacher: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [token, setToken] = useState("");

  // Get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch student profile + exam leave requests
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            name: data.student.name,
            email: data.student.email,
          }));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/student/exam-leave", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRequests(data.examLeaves || []);
        }
      } catch (err) {
        console.error("Exam leave fetch error:", err);
      }
    };

    fetchProfile();
    fetchRequests();
  }, [token]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit exam leave form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/student/exam-leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("✅ Exam leave applied!");
        // Reset form (keep name + email)
        setForm((prev) => ({
          ...prev,
          year: "",
          department: "",
          teacher: "",
          fromDate: "",
          toDate: "",
          reason: "",
        }));

        // Refresh exam leaves
        const refreshed = await fetch("/api/student/exam-leave", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (refreshed.ok) {
          const data = await refreshed.json();
          setRequests(data.examLeaves || []);
        }
      } else {
        const data = await res.json();
        alert(`❌ Failed: ${data.error}`);
      }
    } catch (err) {
      console.error("Submit exam leave error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Helper to format dates nicely in UI
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#ffd200] text-center mb-8">
          📝 Apply for Exam Leave
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                disabled
                className="w-full p-3 rounded-lg bg-gray-800 text-gray-400"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="w-full p-3 rounded-lg bg-gray-800 text-gray-400"
              />
            </div>
          </div>

          {/* Editable Year + Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-1">Year</label>
              <input
                type="text"
                name="year"
                placeholder="Enter Year (e.g., FY, SY, TY)"
                value={form.year}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Department</label>
              <input
                type="text"
                name="department"
                placeholder="Enter Department"
                value={form.department}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
                required
              />
            </div>
          </div>

          {/* Teacher */}
          <div>
            <label className="block text-gray-300 mb-1">Teacher</label>
            <input
              type="text"
              name="teacher"
              placeholder="Enter Teacher Name"
              value={form.teacher}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-1">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">To Date</label>
              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-gray-300 mb-1">Reason</label>
            <textarea
              name="reason"
              placeholder="Reason for Exam Leave"
              value={form.reason}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#ffd200] outline-none"
              rows={4}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffd200] hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition"
          >
            {loading ? "Submitting..." : "✅ Submit Exam Leave"}
          </button>
        </form>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* My Requests */}
        <h2 className="text-xl sm:text-2xl font-semibold text-[#ffd200] mb-4">
          📋 My Exam Leave Requests
        </h2>
        {requests.length === 0 ? (
          <p className="text-gray-400">No exam leave requests yet.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="p-4 rounded-lg bg-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="w-full">
                  <p className="font-semibold">Teacher: {req.teacher}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(req.fromDate).toLocaleDateString()} → {new Date(req.toDate).toLocaleDateString()}
                  </p>



  <p className="text-sm text-gray-400">Department: {req.department}</p>
                  {req.department && (
                    <p className="text-sm text-gray-300 mt-1">
                    </p>
                  )}

  <p className="text-sm text-gray-400">Year: {req.year}</p>
                  {req.year && (
                    <p className="text-sm text-gray-300 mt-1">
                    </p>
                  )}

                  <p className="text-sm text-gray-400">Reason: {req.reason}</p>
                  {req.comment && (
                    <p className="text-sm text-gray-300 mt-1">
                      🗨️ Faculty Comment:{" "}
                      <span className="italic">{req.comment}</span>
                    </p>
                  )}



                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${req.status === "Pending"
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
