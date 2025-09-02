"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    year: "FY",
    fromDate: "",
    toDate: "",
    type: "Sick",
    reason: "",
    facultyName: "IT", // ✅ always facultyName
  });
  const [token, setToken] = useState("");

  const faculties = ["IT", "CS", "AIDS", "Civil", "Mechanical"];
  const years = ["FY", "SY", "TY"];
  const leaveTypes = ["Sick", "Casual", "Maternity", "Emergency"];

  // Get token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch profile + leaves
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStudent(data.student);
          setFormData((prev) => ({
            ...prev,
            name: data.student.name || "",
            email: data.student.email || "",
            year: data.student.year || "FY",
          }));
        } else {
          console.error("Profile fetch failed", res.status);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLeaves = async () => {
      try {
        const res = await fetch("/api/student/leaves", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLeaves(data.leaves || []);
        } else {
          console.error("Leaves fetch failed", res.status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchLeaves();
  }, [token]);

  // Submit leave request
  const handleApplyLeave = async () => {
    const { fromDate, toDate, type, reason, facultyName, year } = formData;

    if (!fromDate || !toDate || !type || !reason || !facultyName || !year) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("/api/student/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), // ✅ facultyName included
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to submit leave request.");
        return;
      }

      alert("Leave request submitted!");
      setShowForm(false);

      // Refresh leave list
      const leaveRes = await fetch("/api/student/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await leaveRes.json();
      setLeaves(data.leaves || []);

      // Reset leave form
      setFormData((prev) => ({
        ...prev,
        fromDate: "",
        toDate: "",
        type: "Sick",
        reason: "",
        facultyName: "IT", // ✅ reset as facultyName
      }));
    } catch (err) {
      console.error(err);
      alert("Error submitting leave request.");
    }
  };

  // Delete leave
  const handleDeleteLeave = async (leaveId) => {
    if (!confirm("Are you sure you want to delete this leave request?")) return;

    try {
      const res = await fetch(`/api/student/leaves/${leaveId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete leave request.");
        return;
      }

      alert("Leave request deleted!");
      setLeaves((prev) => prev.filter((l) => l._id !== leaveId));
    } catch (err) {
      console.error(err);
      alert("Error deleting leave request.");
    }
  };

  if (loading || !student)
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 pt-32 pb-20">
  {/* Student Profile */}
{student && (
  <motion.div
    className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-gradient-to-r from-[#ffd200] to-[#ff9500] shadow-md w-full sm:w-fit"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
  >
    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gray-900 text-[#ffd200] font-bold text-base sm:text-lg shadow-sm shrink-0">
      {student.name.charAt(0).toUpperCase()}
    </div>
    <div className="flex flex-col">
      <h2 className="text-sm sm:text-base font-bold text-gray-900">👨‍🎓 {student.name}</h2>
      <p className="text-xs text-gray-800">{student.email}</p>
      <p className="text-xs text-gray-700">{student.year || "N/A"}</p>
    </div>
  </motion.div>
)}


  {/* Leave Summary */}
  <div className="grid md:grid-cols-3 gap-6 mb-12">
    {["Pending", "Approved", "Rejected"].map((status, idx) => {
      const count = leaves.filter((l) => l.status === status).length;
      const colors = { Pending: "#ffd200", Approved: "#93b874", Rejected: "#ff6363" };
      return (
        <motion.div
          key={status}
          className="p-6 rounded-3xl shadow-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderLeft: `6px solid ${colors[status]}`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.2 }}
        >
          <h3 className="text-xl font-bold" style={{ color: colors[status] }}>
            {status}
          </h3>
          <p className="text-2xl mt-2">{count}</p>
        </motion.div>
      );
    })}
  </div>

  {/* Leave Table (Desktop) */}
  <div className="hidden sm:block overflow-x-auto rounded-xl shadow-lg mb-12">
    <table className="min-w-full text-white bg-gray-900 rounded-xl">
      <thead className="bg-gray-800">
        <tr>
          <th className="py-3 px-6 text-left">From</th>
          <th className="py-3 px-6 text-left">To</th>
          <th className="py-3 px-6 text-left">Type</th>
          <th className="py-3 px-6 text-left">Year</th>
          <th className="py-3 px-6 text-left">Faculty</th>
          <th className="py-3 px-6 text-left">Reason</th>
          <th className="py-3 px-6 text-left">Status</th>
          <th className="py-3 px-6 text-left">Comment</th>
          <th className="py-3 px-6 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {leaves.map((leave) => (
          <tr
            key={leave._id}
            className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
          >
            <td className="py-3 px-6">{leave.fromDate}</td>
            <td className="py-3 px-6">{leave.toDate}</td>
            <td className="py-3 px-6">{leave.type}</td>
            <td className="py-3 px-6">{leave.year}</td>
            <td className="py-3 px-6">{leave.facultyName}</td>
            <td className="py-3 px-6">{leave.reason}</td>
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
            <td className="py-3 px-6">
              {leave.comment ? (
                <span className="italic text-gray-300">{leave.comment}</span>
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </td>
            <td className="py-3 px-6">
              <button
                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-sm"
                onClick={() => handleDeleteLeave(leave._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Mobile Cards */}
  <div className="sm:hidden space-y-4 mb-12">
    {leaves.map((leave) => (
      <motion.div
        key={leave._id}
        className="p-4 rounded-2xl bg-gray-900 shadow-md"
        whileHover={{ scale: 1.02 }}
      >
        <p><strong>📅 {leave.fromDate} → {leave.toDate}</strong></p>
        <p className="text-sm text-gray-300">Type: {leave.type}</p>
        <p className="text-sm text-gray-300">Faculty: {leave.facultyName}</p>
        <p className="text-sm text-gray-300">Reason: {leave.reason}</p>
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
          <button
            className="flex-1 bg-[#93b874] hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold"
            onClick={() => setSelectedLeave(leave)}
          >
            Review
          </button>
          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"
            onClick={() => handleDeleteLeave(leave._id)}
          >
            Delete
          </button>
        </div>
      </motion.div>
    ))}
  </div>

  {/* Apply Leave Modal */}
  {showForm && (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-auto">
      <motion.div
        className="bg-gray-900 p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="text-2xl font-bold text-[#ffd200] mb-6 text-center">
          Apply for Leave
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <select
          className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
          value={formData.year || "FY"}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <div className="flex gap-4 mb-4">
          <input
            type="date"
            className="w-1/2 p-3 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
            value={formData.fromDate || ""}
            onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
          />
          <input
            type="date"
            className="w-1/2 p-3 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
            value={formData.toDate || ""}
            onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
          />
        </div>

        <select
          className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
          value={formData.type || "Sick"}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          {leaveTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Reason"
          className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
          value={formData.reason || ""}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        />
        <select
          className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
          value={formData.facultyName || faculties[0]}
          onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
        >
          {faculties.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-600 px-5 py-2 rounded-xl hover:bg-gray-500 transition-colors font-semibold"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
          <button
            className="bg-[#93b874] px-5 py-2 rounded-xl hover:bg-green-600 transition-colors font-semibold"
            onClick={handleApplyLeave}
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  )}
</div>
);

}
