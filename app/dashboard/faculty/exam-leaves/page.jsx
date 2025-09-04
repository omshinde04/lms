"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trash2 } from "lucide-react";

export default function FacultyExamLeaves() {
  const [faculty, setFaculty] = useState(null);
  const [examLeaves, setExamLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [comment, setComment] = useState("");

  // ✅ Fetch faculty profile
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/faculty/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) setFaculty(data.faculty);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  // ✅ Fetch all student exam leaves
  const fetchExamLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/faculty/exam-leaves", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) setExamLeaves(data.examLeaves || []);
    } catch (err) {
      console.error("Error fetching exam leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchExamLeaves();
  }, []);

  // ✅ Approve / Reject Exam Leave
  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`/api/faculty/exam-leaves/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status, comment }),
      });

      if (res.ok) {
        alert(`Exam Leave ${status} successfully ✅`);
        setComment("");
        setSelectedLeave(null);
        fetchExamLeaves();
      } else {
        alert("❌ Failed to update exam leave");
      }
    } catch (err) {
      console.error("Error updating exam leave:", err);
      alert("⚠️ Something went wrong while updating");
    }
  };

  // ✅ Delete Exam Leave
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this exam leave request?")) return;

    try {
      const res = await fetch(`/api/faculty/exam-leaves/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.ok) {
        alert("✅ Exam Leave deleted successfully");
        setSelectedLeave(null);
        fetchExamLeaves();
      } else {
        const data = await res.json();
        alert(`❌ Failed: ${data.error}`);
      }
    } catch (err) {
      console.error("Error deleting exam leave:", err);
      alert("⚠️ Something went wrong while deleting");
    }
  };

  // 🔹 Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 sm:px-6 pt-24 sm:pt-32 pb-20">
      {/* Faculty Profile */}
      {faculty && (
        <motion.div
          className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#ffd200] to-[#ff9500] shadow-lg w-full sm:w-fit"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 text-[#ffd200] font-extrabold text-lg">
            {faculty.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">👨‍🏫 {faculty.name}</h2>
            <p className="text-xs sm:text-sm text-gray-800">{faculty.email}</p>
            <p className="text-xs sm:text-sm text-gray-700">
              {faculty.department || "N/A"} • {faculty.role}
            </p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.h1
        className="text-3xl sm:text-4xl font-extrabold text-center text-[#ffd200] mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🎓 Manage Exam Leave Requests
      </motion.h1>

      {/* Loading / Empty */}
      {loading ? (
        <p className="text-center text-lg animate-pulse">Loading exam leave requests...</p>
      ) : examLeaves.length === 0 ? (
        <p className="text-center text-gray-400">No exam leave requests yet.</p>
      ) : (
        <div className="space-y-4">
          {examLeaves.map((leave) => (
            <motion.div
              key={leave._id}
              className="p-4 rounded-xl bg-gray-900 shadow-md flex flex-col sm:flex-row justify-between gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex-1">
                <p className="font-semibold">👨‍🎓 {leave.studentId?.name} ({leave.year})</p>
                <p className="text-sm text-gray-300">📧 {leave.studentId?.email}</p>
                <p className="text-sm text-gray-300">Dept: {leave.department}</p>
                <p className="text-sm text-gray-300">Teacher: {leave.teacher}</p>
                <p className="text-sm text-gray-300">
                  {formatDate(leave.fromDate)} → {formatDate(leave.toDate)}
                </p>
                <p className="text-sm text-gray-400">Reason: {leave.reason}</p>
                <p className="italic text-gray-400">{leave.comment || "—"}</p>
              </div>

              <div className="flex flex-col gap-2 sm:w-40">
                {leave.status === "Pending" ? (
                  <button
                    className="bg-[#ffd200] hover:bg-yellow-500 text-black px-3 py-2 rounded-lg font-semibold flex items-center gap-1"
                    onClick={() => setSelectedLeave(leave)}
                  >
                    <Check size={16} /> Review
                  </button>
                ) : (
                  <span
                    className={`px-3 py-2 rounded-lg text-center font-bold ${
                      leave.status === "Approved"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {leave.status}
                  </span>
                )}
                <button
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg font-semibold flex items-center gap-1"
                  onClick={() => handleDelete(leave._id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for Review */}
      <AnimatePresence>
        {selectedLeave && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 px-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-3xl shadow-xl w-full max-w-md text-white"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-[#ffd200] mb-4">Review Exam Leave</h2>
              <p className="mb-2"><strong>Student:</strong> {selectedLeave.studentId?.name}</p>
              <p className="mb-2"><strong>Email:</strong> {selectedLeave.studentId?.email}</p>
              <p className="mb-4"><strong>Reason:</strong> {selectedLeave.reason}</p>

              <textarea
                placeholder="Add comment (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-xl bg-white text-black mb-4 focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAction(selectedLeave._id, "Approved")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-1"
                >
                  <Check size={18} /> Approve
                </button>
                <button
                  onClick={() => handleAction(selectedLeave._id, "Rejected")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-1"
                >
                  <X size={18} /> Reject
                </button>
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="flex-1 px-4 py-2 border border-gray-500 rounded-xl font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
