"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trash2, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
      if (res.ok) {
        setExamLeaves(Array.isArray(data) ? data : data.examLeaves || []);
      }
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

  // 🔹 Export to Excel
  const exportToExcel = () => {
    if (examLeaves.length === 0) {
      alert("⚠️ No exam leaves to export");
      return;
    }

    const sheetData = examLeaves.map((leave) => ({
      Student: leave.studentId?.name,
      Email: leave.studentId?.email,
      Department: leave.department,
      Teacher: leave.teacher,
      Year: leave.year,
      FromDate: leave.fromDate,
      ToDate: leave.toDate,
      Reason: leave.reason,
      Status: leave.status,
      Comment: leave.comment || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ExamLeaves");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ExamLeaves_Report.xlsx");
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

  // 🔹 Group leaves by department then year
  const groupByDepartmentAndYear = (leaves) => {
    return leaves.reduce((departments, leave) => {
      const dept = leave.department || "Unknown Dept";
      const year = leave.year || "Unknown Year";

      if (!departments[dept]) departments[dept] = {};
      if (!departments[dept][year]) departments[dept][year] = [];

      departments[dept][year].push(leave);
      return departments;
    }, {});
  };

  const groupedLeaves = groupByDepartmentAndYear(examLeaves);

  // 🔹 Approve / Reject Exam Leave
  const handleAction = async (id, status) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/faculty/exam-leaves/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Exam leave ${status.toLowerCase()} successfully`);
        setExamLeaves((prev) =>
          prev.map((leave) => (leave._id === id ? data.examLeave : leave))
        );
        setSelectedLeave(null);
        setComment("");
      } else {
        alert(`⚠️ ${data.error || "Failed to update leave"}`);
      }
    } catch (err) {
      console.error("Error updating exam leave:", err);
      alert("⚠️ Something went wrong");
    }
  };

  // 🔹 Delete Exam Leave
  const handleDelete = async (id) => {
    if (!id) return;
    const confirmDelete = confirm("Are you sure you want to delete this exam leave?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/faculty/exam-leaves/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("🗑️ Exam leave deleted successfully");
        setExamLeaves((prev) => prev.filter((leave) => leave._id !== id));
      } else {
        alert(`⚠️ ${data.error || "Failed to delete leave"}`);
      }
    } catch (err) {
      console.error("Error deleting exam leave:", err);
      alert("⚠️ Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white px-3 sm:px-6 pt-24 sm:pt-28 pb-20">
      {/* Faculty Profile */}
      {faculty && (
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 mb-10 p-5 rounded-2xl bg-gradient-to-r from-[#ffd200] to-[#ff9500] shadow-xl w-full sm:w-fit mx-auto"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-900 text-[#ffd200] font-extrabold text-xl shadow-lg">
            {faculty.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              👨‍🏫 {faculty.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-800">{faculty.email}</p>
            <p className="text-xs sm:text-sm text-gray-700">{faculty.role}</p>
          </div>
        </motion.div>
      )}

      {/* Header + Export Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-[#ffd200] drop-shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🎓 Manage Exam Leave Requests
        </motion.h1>
        <button
          onClick={exportToExcel}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-semibold transition-transform hover:scale-105"
        >
          <FileSpreadsheet size={18} /> Export to Excel
        </button>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <p className="text-center text-lg animate-pulse">
          Loading exam leave requests...
        </p>
      ) : examLeaves.length === 0 ? (
        <p className="text-center text-gray-400">No exam leave requests yet.</p>
      ) : (
        Object.keys(groupedLeaves).map((dept) => (
          <div key={dept} className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#ffd200] mb-6 border-b border-gray-700 pb-2">
              🏢 {dept}
            </h2>

            {Object.keys(groupedLeaves[dept]).map((year) => (
              <div key={year} className="mb-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#ffd200] mb-4 border-b border-gray-700 pb-1">
                  📘 {year}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedLeaves[dept][year].map((leave) => (
                    <motion.div
                      key={leave._id}
                      className="p-5 rounded-2xl bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex-1 space-y-2">
                        <p className="font-semibold text-lg">
                          👨‍🎓 {leave.studentId?.name}{" "}
                          <span className="text-sm text-gray-400">
                            ({leave.year})
                          </span>
                        </p>
                        <p className="text-sm text-gray-300">
                          📧 {leave.studentId?.email}
                        </p>
                        <p className="text-sm text-gray-300">
                          Dept: {leave.department}
                        </p>
                        <p className="text-sm text-gray-300">
                          Teacher: {leave.teacher}
                        </p>
                        <p className="text-sm text-gray-300">
                          {formatDate(leave.fromDate)} → {formatDate(leave.toDate)}
                        </p>
                        <p className="text-sm text-gray-400">Reason: {leave.reason}</p>
                        <p className="italic text-gray-500">
                          {leave.comment || "—"}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        {leave.status === "Pending" ? (
                          <button
                            className="flex-1 bg-[#ffd200] hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-1 transition-transform hover:scale-105"
                            onClick={() => setSelectedLeave(leave)}
                          >
                            <Check size={18} /> Review
                          </button>
                        ) : (
                          <span
                            className={`flex-1 px-4 py-2 rounded-xl text-center font-bold ${
                              leave.status === "Approved"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {leave.status}
                          </span>
                        )}
                        <button
                          className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-1 transition-transform hover:scale-105"
                          onClick={() => handleDelete(leave._id)}
                        >
                          <Trash2 size={18} /> Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {selectedLeave && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 px-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-3xl shadow-2xl w-full max-w-md text-white"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-[#ffd200] mb-4">
                Review Exam Leave
              </h2>
              <p className="mb-2">
                <strong>Student:</strong> {selectedLeave.studentId?.name}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {selectedLeave.studentId?.email}
              </p>
              <p className="mb-4">
                <strong>Reason:</strong> {selectedLeave.reason}
              </p>

              <textarea
                placeholder="Add comment (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-xl bg-white text-black mb-4 focus:outline-none focus:ring-2 focus:ring-[#ffd200] resize-none"
                rows={3}
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleAction(selectedLeave._id, "Approved")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-1 transition-transform hover:scale-105"
                >
                  <Check size={18} /> Approve
                </button>
                <button
                  onClick={() => handleAction(selectedLeave._id, "Rejected")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-1 transition-transform hover:scale-105"
                >
                  <X size={18} /> Reject
                </button>
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
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
