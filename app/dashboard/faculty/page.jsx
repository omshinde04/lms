"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LeaveStatsChart from "../../../components/LeaveStatsChart";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function FacultyDashboard() {
  const [faculty, setFaculty] = useState(null);
  const [leaves, setLeaves] = useState([]);
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

  // ✅ Fetch all student leaves (with student email)
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/faculty/leaves", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) setLeaves(data.leaves);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchLeaves();
  }, []);

  // ✅ Approve / Reject Leave
  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`/api/faculty/leaves/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status, comment }),
      });

      if (res.ok) {
        alert(`Leave ${status} successfully ✅`);
        setComment("");
        setSelectedLeave(null);
        fetchLeaves();
      } else {
        alert("❌ Failed to update leave");
      }
    } catch (err) {
      console.error("Error updating leave:", err);
      alert("⚠️ Something went wrong while updating leave");
    }
  };

  // ✅ Delete Leave
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this leave request?")) return;

    try {
      const res = await fetch(`/api/faculty/leaves/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        alert("✅ Leave deleted successfully");
        setSelectedLeave(null);
        fetchLeaves();
      } else {
        const data = await res.json();
        alert(`❌ Failed to delete leave: ${data.error}`);
      }
    } catch (err) {
      console.error("Error deleting leave:", err);
      alert("⚠️ Something went wrong while deleting leave");
    }
  };

  // ✅ Group leaves by Year + Faculty
  const groupedLeaves = leaves.reduce((groups, leave) => {
    const key = `${leave.year} • ${leave.facultyName}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(leave);
    return groups;
  }, {});


const exportToExcel = () => {
  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(
  leaves.map(l => ({
    Student: l.studentId?.name,
    Email: l.studentId?.email,
    Year: l.year,
    Type: l.type,
    Dates: `${l.fromDate} → ${l.toDate}`,
    Reason: l.reason,
    Faculty: l.facultyName,
    Teacher: l.teacherName,
    Certificate: l.certificate ? l.certificate : "-",
    Status: l.status,
    Comment: l.comment || "-"
  }))
);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leaves Report");

  // Save file
  XLSX.writeFile(workbook, "Leaves_Report.xlsx");
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
          {/* Small circular avatar */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gray-900 text-[#ffd200] font-extrabold text-lg sm:text-xl shadow-md shrink-0">
            {faculty.name.charAt(0).toUpperCase()}
          </div>

          {/* Faculty info */}
          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              👨‍🏫 {faculty.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-800">{faculty.email}</p>
            <p className="text-xs sm:text-sm text-gray-700">{faculty.role}</p>
          </div>
        </motion.div>
      )}

      {/* 📊 Export Button - Centered & Responsive */}
      <div className="flex justify-center mb-10">
        <button
          onClick={exportToExcel}
          className="
            w-full sm:w-auto 
            bg-[#ffd200] text-black 
            px-6 py-3 
            rounded-xl font-bold 
            text-sm sm:text-base md:text-lg 
            flex items-center justify-center gap-2
            hover:bg-yellow-500 
            transition duration-300 ease-in-out
            shadow-md hover:shadow-lg
          "
        >
          📊 <span>Export to Excel</span>
        </button>
      </div>

      {/* Dynamic Pie Chart */}
      <LeaveStatsChart leaves={leaves} />

      {/* Dashboard Header */}
      <motion.h1
        className="text-3xl sm:text-4xl font-extrabold text-center text-[#ffd200] mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📚 Faculty Dashboard
      </motion.h1>

      {/* Loading / Empty */}
      {loading ? (
        <p className="text-center text-lg animate-pulse">Loading leave requests...</p>
      ) : leaves.length === 0 ? (
        <p className="text-center text-gray-400">No leave requests yet.</p>
      ) : (
        Object.entries(groupedLeaves).map(([group, groupLeaves]) => (
          <motion.div key={group} className="mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#93b874] mb-4">
              {group}
            </h2>

            {/* Table (Desktop) */}
            <div className="hidden sm:block overflow-x-auto rounded-xl shadow-lg">
              <table className="min-w-full text-white bg-gray-900 rounded-xl">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="py-3 px-6 text-left">Student</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Year</th>
                    <th className="py-3 px-6 text-left">Type</th>
                    <th className="py-3 px-6 text-left">Certificate</th>
                    <th className="py-3 px-6 text-left">Dates</th>
                    <th className="py-3 px-6 text-left">Reason</th>
                    <th className="py-3 px-6 text-left">Faculty</th>
                    <th className="py-3 px-6 text-left">Teacher</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Comment</th>
                    <th className="py-3 px-6 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {groupLeaves.map((leave) => (
                    <tr
                      key={leave._id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-3 px-6">{leave.studentId?.name}</td>
                      <td className="py-3 px-6">{leave.studentId?.email}</td>
                      <td className="py-3 px-6">{leave.year}</td>
                      <td className="py-3 px-6">{leave.type}</td>

                      {/* ✅ Certificate column */}
                      <td className="py-3 px-6">
                        {leave.certificate ? (
                          leave.certificate.endsWith(".pdf") ? (
                            <a
                              href={leave.certificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#ffd200] underline"
                            >
                              📄 View PDF
                            </a>
                          ) : (
                            <a
                              href={leave.certificate}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={leave.certificate}
                                alt="Certificate"
                                className="w-12 h-12 object-cover rounded-lg border border-gray-600"
                              />
                            </a>
                          )
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>

                      <td className="py-3 px-6">
                        {leave.fromDate} → {leave.toDate}
                      </td>
                      <td className="py-3 px-6">{leave.reason}</td>
                      <td className="py-3 px-6">{leave.facultyName}</td>
                      <td className="py-3 px-6">{leave.teacherName}</td>
                      <td
                        className="py-3 px-6 font-bold"
                        style={{
                          color:
                            leave.status === "Approved"
                              ? "#93b874"
                              : leave.status === "Rejected"
                              ? "#ff6363"
                              : "#ffd200",
                        }}
                      >
                        {leave.status}
                      </td>
                      <td className="py-3 px-6 italic text-gray-300">
                        {leave.comment || "—"}
                      </td>
                      <td className="py-3 px-6 flex gap-2">
                        {leave.status === "Pending" ? (
                          <button
                            className="bg-[#93b874] hover:bg-green-600 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1"
                            onClick={() => setSelectedLeave(leave)}
                          >
                            <Check size={16} /> Review
                          </button>
                        ) : (
                          <span className="text-gray-500 text-sm">Reviewed</span>
                        )}
                        <button
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1"
                          onClick={() => handleDelete(leave._id)}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4">
              {groupLeaves.map((leave) => (
                <motion.div
                  key={leave._id}
                  className="p-4 rounded-2xl bg-gray-900 shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <p>
                    <strong>👨‍🎓 {leave.studentId?.name}</strong> ({leave.year})
                  </p>
                  <p className="text-sm text-gray-300">📧 {leave.studentId?.email}</p>
                  <p className="text-sm text-gray-300">Type: {leave.type}</p>
                  <p className="text-sm text-gray-300">
                    {leave.fromDate} → {leave.toDate}
                  </p>
                  <p className="text-sm text-gray-300">Reason: {leave.reason}</p>
                  <p className="text-sm text-gray-400">Faculty: {leave.facultyName}</p>
                  <p className="text-sm text-gray-400">Teacher: {leave.teacherName}</p>

                  {/* ✅ Certificate (mobile) */}
                  {leave.certificate && (
                    <div className="mt-2">
                      {leave.certificate.endsWith(".pdf") ? (
                        <a
                          href={leave.certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ffd200] underline"
                        >
                          📄 View PDF
                        </a>
                      ) : (
                        <a
                          href={leave.certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={leave.certificate}
                            alt="Certificate"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                          />
                        </a>
                      )}
                    </div>
                  )}

                  <p
                    className="font-bold mt-2"
                    style={{
                      color:
                        leave.status === "Approved"
                          ? "#93b874"
                          : leave.status === "Rejected"
                          ? "#ff6363"
                          : "#ffd200",
                    }}
                  >
                    {leave.status}
                  </p>
                  <p className="italic text-gray-400">{leave.comment || "—"}</p>

                  <div className="mt-3 flex gap-2">
                    {leave.status === "Pending" && (
                      <button
                        className="flex-1 bg-[#ffd200] hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold"
                        onClick={() => setSelectedLeave(leave)}
                      >
                        Review
                      </button>
                    )}
                    <button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"
                      onClick={() => handleDelete(leave._id)}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))
      )}

      {/* ✅ Modal for Approve/Reject/Delete */}
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
              <h2 className="text-2xl font-bold text-[#ffd200] mb-4">
                Review Leave Request
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
                className="w-full p-3 rounded-xl bg-white text-black mb-4 focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAction(selectedLeave._id, "Approved")}
                  className="flex-1 bg-[#93b874] hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-1"
                >
                  <Check size={18} /> Approve
                </button>
                <button
                  onClick={() => handleAction(selectedLeave._id, "Rejected")}
                  className="flex-1 bg-[#ff6363] hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-1"
                >
                  <X size={18} /> Reject
                </button>
                <button
                  onClick={() => handleDelete(selectedLeave._id)}
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-1"
                >
                  <Trash2 size={18} /> Delete
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
