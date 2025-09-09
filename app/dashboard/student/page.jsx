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
    facultyName: "IT",
    teacherName: "",
    certificateFile: null, // ✅ store actual file
    certificateUrl: "", // ✅ for preview & Cloudinary upload
  });
  const [token, setToken] = useState("");

  const faculties = ["IT", "CS", "AIDS", "Civil", "Mechanical"];
  const years = ["FY", "SY", "TY"];
  const leaveTypes = ["Sick", "Casual", "Maternity", "Emergency"];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

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



  
const uploadCertificate = async (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("File size exceeds 10MB. Please select a smaller file.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // must be unsigned

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await res.json();

    if (!res.ok) {
      const msg = result.error?.message || JSON.stringify(result.error) || "Upload failed";
      throw new Error(msg);
    }

    return result.secure_url; // ✅ URL to save in DB
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw new Error(err.message || "Failed to upload file.");
  }
};

const handleApplyLeave = async () => {
  const { fromDate, toDate, type, reason, facultyName, year, teacherName, certificateFile } = formData;

  // ✅ Validate required fields
  if (!fromDate || !toDate || !type || !reason || !facultyName || !year || !teacherName) {
    alert("All fields are required!");
    return;
  }

  // ✅ Check certificate file size (10MB max)
  if (certificateFile) {
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (certificateFile.size > maxSize) {
      alert("Certificate file size exceeds 10MB. Please select a smaller file.");
      return; // stop submission
    }
  }

  try {
    let certificateUrl = "";

    // Upload to Cloudinary if selected
    if (certificateFile) {
      certificateUrl = await uploadCertificate(certificateFile);
    }

    const res = await fetch("/api/student/leaves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fromDate,
        toDate,
        type,
        reason,
        facultyName,
        teacherName,
        year,
        certificate: certificateUrl, // ✅ send URL
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to submit leave request.");
      return;
    }

    alert("Leave request submitted!");
    setShowForm(false);

    // refresh leaves
    const leaveRes = await fetch("/api/student/leaves", { headers: { Authorization: `Bearer ${token}` } });
    const leaveData = await leaveRes.json();
    setLeaves(leaveData.leaves || []);

    setFormData({
      fromDate: "",
      toDate: "",
      type: "Sick",
      reason: "",
      facultyName: "IT",
      teacherName: "",
      certificateFile: null,
      certificateUrl: "",
    });
  } catch (err) {
    console.error("Leave submit error:", err);
    alert("Error submitting leave request.");
  }
};

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
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 sm:px-6 pt-24 sm:pt-32 pb-20">
    {/* Header */}
    <motion.div
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4 sm:gap-0"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4 cursor-pointer flex-wrap sm:flex-nowrap">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#ffd200] shadow-lg bg-gray-600 flex items-center justify-center text-2xl sm:text-3xl font-bold">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-bold">{student.name}</h2>
          <p className="text-gray-300 text-sm sm:text-base">{student.email}</p>
        </div>
      </div>

      <button
        className="bg-[#93b874] px-4 sm:px-6 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
        onClick={() => setShowForm(true)}
      >
        Apply Leave
      </button>
    </motion.div>

    {/* Leave Summary */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
      {["Pending", "Approved", "Rejected"].map((status, idx) => {
        const count = leaves.filter((l) => l.status === status).length;
        const colors = { Pending: "#ffd200", Approved: "#93b874", Rejected: "#ff6363" };
        return (
          <motion.div
            key={status}
            className="p-4 sm:p-6 rounded-2xl shadow-lg"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderLeft: `6px solid ${colors[status]}`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
          >
            <h3 className="text-lg sm:text-xl font-bold" style={{ color: colors[status] }}>
              {status}
            </h3>
            <p className="text-xl sm:text-2xl mt-1 sm:mt-2">{count}</p>
          </motion.div>
        );
      })}
    </div>

    {/* Leave Table */}
    <div className="overflow-x-auto rounded-xl shadow-lg mb-8 sm:mb-12">
      <table className="min-w-full text-white bg-gray-900 rounded-xl text-sm sm:text-base">
        <thead className="bg-gray-800">
          <tr>
            {[
              "From",
              "To",
              "Type",
              "Year",
              "Faculty",
              "Reason",
              "Certificate",
              "Status",
              "Comment",
              "Action",
            ].map((th) => (
              <th key={th} className="py-2 px-4 sm:py-3 sm:px-6 text-left">
                {th}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr
              key={leave._id}
              className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <td className="py-2 px-4 sm:py-3 sm:px-6">{leave.fromDate}</td>
              <td className="py-2 px-4 sm:py-3 sm:px-6">{leave.toDate}</td>
              <td className="py-2 px-4 sm:py-3 sm:px-6">{leave.type}</td>
              <td className="py-2 px-4 sm:py-3 sm:px-6">{leave.year}</td>
              <td className="py-2 px-4 sm:py-3 sm:px-6">{leave.facultyName}</td>
              <td className="py-2 px-4 sm:py-3 sm:px-6">{leave.reason}</td>

              {/* ✅ Certificate column */}
              <td className="py-2 px-4 sm:py-3 sm:px-6">
                {leave.certificate && leave.certificate !== "" ? (
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

              <td
                className="py-2 px-4 sm:py-3 sm:px-6 font-bold"
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
              <td className="py-2 px-4 sm:py-3 sm:px-6">
                {leave.comment ? (
                  <span className="italic text-gray-300">{leave.comment}</span>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </td>
              <td className="py-2 px-4 sm:py-3 sm:px-6">
                <button
                  className="bg-red-600 hover:bg-red-500 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm"
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

    {/* Apply Leave Modal */}
    {showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-auto">
        <motion.div
          className="bg-gray-900 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-xl"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-[#ffd200] mb-6 text-center">
            Apply for Leave
          </h2>

          {/* Student Info */}
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <label className="block text-sm font-semibold mb-1">Year</label>
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

          {/* Leave Info */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-semibold mb-1">From</label>
              <input
                type="date"
                className="w-full p-3 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
                value={formData.fromDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fromDate: e.target.value })
                }
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-semibold mb-1">To</label>
              <input
                type="date"
                className="w-full p-3 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
                value={formData.toDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, toDate: e.target.value })
                }
              />
            </div>
          </div>

          <label className="block text-sm font-semibold mb-1">Leave Type</label>
          <select
            className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
            value={formData.type || "Sick"}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            {leaveTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label className="block text-sm font-semibold mb-1">Reason</label>
          <input
            type="text"
            placeholder="Enter reason for leave"
            className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
            value={formData.reason || ""}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />

          {/* Teacher Name */}
          <label className="block text-sm font-semibold mb-1">Teacher Name</label>
          <input
            type="text"
            placeholder="Enter teacher's name"
            className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
            value={formData.teacherName || ""}
            onChange={(e) =>
              setFormData({ ...formData, teacherName: e.target.value })
            }
          />

          <label className="block text-sm font-semibold mb-1">
            Faculty Department
          </label>
          <select
            className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
            value={formData.facultyName || "IT"}
            onChange={(e) =>
              setFormData({ ...formData, facultyName: e.target.value })
            }
          >
            {faculties.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* ✅ Upload Certificate */}
          <label className="block text-sm font-semibold mb-1">Upload Certificate</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="w-full p-3 mb-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ffd200]"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              setFormData((prev) => ({
                ...prev,
                certificateFile: file, // ✅ store actual file object
                certificateUrl: URL.createObjectURL(file), // ✅ for preview only
              }));
            }}
          />

          {/* ✅ Preview Section */}
          {formData.certificateUrl && (
            <div className="mb-4">
              {formData.certificateFile.type === "application/pdf" ? (
                <p className="text-sm text-gray-300 italic">📄 PDF uploaded</p>
              ) : (
                <img
                  src={formData.certificateUrl}
                  alt="Certificate Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                />
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
            <button
              className="bg-gray-600 px-5 py-2 rounded-xl hover:bg-gray-500 transition-colors font-semibold w-full sm:w-auto"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              className="bg-[#93b874] px-5 py-2 rounded-xl hover:bg-green-600 transition-colors font-semibold w-full sm:w-auto"
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
