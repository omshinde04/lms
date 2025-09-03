"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HODDashboard() {
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("accounts");

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || []);
      setFaculty(data.faculty || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ✅ Fetch leaves
  const fetchLeaves = async () => {
    try {
      const res = await fetch("/api/hod", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch leaves");
      const data = await res.json();
      setLeaves(data || []);
    } catch (err) {
      console.error("Error fetching faculty leaves:", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchUsers(), fetchLeaves()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // ✅ Delete user
  const handleDelete = async (id, role) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        alert("✅ User deleted successfully!");
        if (role === "student") setUsers(users.filter((u) => u._id !== id));
        else setFaculty(faculty.filter((f) => f._id !== id));
      } else {
        alert("❌ Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting user.");
    }
  };

  // ✅ Approve/Reject leave
  const handleLeaveAction = async (id, action) => {
    try {
      const res = await fetch(`/api/hod/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: action }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Leave ${action} successfully!`);
        const updated = leaves.map((l) =>
          l._id === id ? { ...l, status: action } : l
        );
        setLeaves(updated);
      } else {
        alert(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Network error while updating leave.");
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );

  // Filters for accounts
  const filteredUsers = users.filter(
    (u) =>
      (filterRole === "all" || u.role === filterRole) &&
      u.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredFaculty = faculty.filter(
    (f) =>
      (filterRole === "all" || f.role === filterRole) &&
      f.name.toLowerCase().includes(search.toLowerCase())
  );

  // Filters for leaves
  const filteredLeaves = leaves.filter(
    (l) =>
      (statusFilter === "all" || l.status === statusFilter) &&
      (deptFilter === "all" || l.department === deptFilter)
  );
// Replace your renderTable and renderLeaveTable with these:

// 🔹 Accounts Table (Students/Faculty)
const renderTable = (data, roleColor) => (
  <div className="overflow-x-auto">
    <table className="hidden md:table min-w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-xl shadow-lg">
      <thead className={`bg-${roleColor}-700`}>
        <tr>
          <th className="py-3 px-6 text-left">ID</th>
          <th className="py-3 px-6 text-left">Name</th>
          <th className="py-3 px-6 text-left">Email</th>
          <th className="py-3 px-6 text-left">Role</th>
          <th className="py-3 px-6 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user) => (
          <tr
            key={user._id}
            className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
          >
            <td className="py-3 px-6">{user._id}</td>
            <td className="py-3 px-6">{user.name}</td>
            <td className="py-3 px-6">{user.email}</td>
            <td className="py-3 px-6">{user.role}</td>
            <td className="py-3 px-6 text-center">
              <button
                onClick={() => handleDelete(user._id, user.role)}
                className="bg-[#ff6363] px-4 py-1 rounded-lg hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Mobile Card View */}
    <div className="grid md:hidden gap-4">
      {data.map((user) => (
        <div
          key={user._id}
          className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-4 shadow-lg border border-gray-700"
        >
          <p><span className="font-bold text-yellow-400">ID:</span> {user._id}</p>
          <p><span className="font-bold text-yellow-400">Name:</span> {user.name}</p>
          <p><span className="font-bold text-yellow-400">Email:</span> {user.email}</p>
          <p><span className="font-bold text-yellow-400">Role:</span> {user.role}</p>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => handleDelete(user._id, user.role)}
              className="bg-[#ff6363] px-4 py-1 rounded-lg hover:bg-red-500 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 🔹 Leave Requests Table
const renderLeaveTable = () => (
  <div className="overflow-x-auto">
    {/* Filters */}
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <select
        className="p-3 rounded-xl text-black"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
      <select
        className="p-3 rounded-xl text-black"
        value={deptFilter}
        onChange={(e) => setDeptFilter(e.target.value)}
      >
        <option value="all">All Departments</option>
        <option value="IT">IT</option>
        <option value="CS">CS</option>
        <option value="AIDS">AIDS</option>
        <option value="Civil">Civil</option>
        <option value="Mechanical">Mechanical</option>
      </select>
    </div>

    {/* Desktop Table */}
    <table className="hidden md:table min-w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-xl shadow-lg">
      <thead className="bg-blue-700">
        <tr>
          <th className="py-3 px-6 text-left">Faculty Name</th>
          <th className="py-3 px-6 text-left">Email</th>
          <th className="py-3 px-6 text-left">Department</th>
          <th className="py-3 px-6 text-left">Type</th>
          <th className="py-3 px-6 text-left">From</th>
          <th className="py-3 px-6 text-left">To</th>
          <th className="py-3 px-6 text-left">Reason</th>
          <th className="py-3 px-6 text-left">Status</th>
          <th className="py-3 px-6 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredLeaves.map((leave) => (
          <tr
            key={leave._id}
            className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
          >
            <td className="py-3 px-6">{leave.facultyId?.name || "N/A"}</td>
            <td className="py-3 px-6">{leave.facultyId?.email || "N/A"}</td>
            <td className="py-3 px-6">{leave.department || "N/A"}</td>
            <td className="py-3 px-6">{leave.type}</td>
            <td className="py-3 px-6">{leave.fromDate}</td>
            <td className="py-3 px-6">{leave.toDate}</td>
            <td className="py-3 px-6">{leave.reason}</td>
            <td className="py-3 px-6 font-bold">{leave.status}</td>
            <td className="py-3 px-6 text-center flex gap-2 justify-center">
              <button
                onClick={() => handleLeaveAction(leave._id, "Approved")}
                className="bg-green-600 px-3 py-1 rounded-lg hover:bg-green-500"
              >
                Approve
              </button>
              <button
                onClick={() => handleLeaveAction(leave._id, "Rejected")}
                className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-500"
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

 {/* Mobile Card View */}
<div className="grid md:hidden gap-4">
  {filteredLeaves.map((leave) => (
    <div
      key={leave._id}
      className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-4 shadow-lg border border-gray-700"
    >
      <p><span className="font-bold text-blue-400">Faculty Name:</span> {leave.facultyName || leave.facultyId?.name || "N/A"}</p>
      <p><span className="font-bold text-blue-400">Email:</span> {leave.facultyId?.email || "N/A"}</p>
      <p><span className="font-bold text-blue-400">Dept:</span> {leave.department || "N/A"}</p>
      <p><span className="font-bold text-blue-400">Type:</span> {leave.type}</p>
      <p><span className="font-bold text-blue-400">From:</span> {leave.fromDate}</p>
      <p><span className="font-bold text-blue-400">To:</span> {leave.toDate}</p>
      <p><span className="font-bold text-blue-400">Reason:</span> {leave.reason}</p>
      <p className="font-bold text-yellow-300">Status: {leave.status}</p>
      <div className="mt-3 flex gap-2 justify-end">
        <button
          onClick={() => handleLeaveAction(leave._id, "Approved")}
          className="bg-green-600 px-3 py-1 rounded-lg hover:bg-green-500"
        >
          Approve
        </button>
        <button
          onClick={() => handleLeaveAction(leave._id, "Rejected")}
          className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-500"
        >
          Reject
        </button>
      </div>
    </div>
  ))}
</div>

  </div>
);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 pt-32 pb-20">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-center mb-12 bg-gradient-to-r from-[#ffd200] to-[#93b874] bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        HOD Dashboard
      </motion.h1>

      {/* Tabs */}
      <div className="flex justify-center gap-6 mb-12">
        <button
          onClick={() => setActiveTab("accounts")}
          className={`px-6 py-2 rounded-xl font-bold ${
            activeTab === "accounts"
              ? "bg-yellow-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Manage Accounts
        </button>
        <button
          onClick={() => setActiveTab("leaves")}
          className={`px-6 py-2 rounded-xl font-bold ${
            activeTab === "leaves"
              ? "bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Faculty Leave Requests
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "accounts" ? (
        <div>
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="p-3 rounded-xl w-full md:w-1/2 text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="p-3 rounded-xl text-black"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          {/* Students Section */}
          <h2 className="text-3xl font-bold text-[#ffd200] mb-6">Students</h2>
          {filteredUsers.length > 0 ? (
            renderTable(filteredUsers, "yellow")
          ) : (
            <p className="text-gray-300 mb-8">No students found.</p>
          )}

          {/* Faculty Section */}
          <h2 className="text-3xl font-bold text-[#93b874] mb-6">Faculty</h2>
          {filteredFaculty.length > 0 ? (
            renderTable(filteredFaculty, "green")
          ) : (
            <p className="text-gray-300">No faculty found.</p>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-blue-400 mb-6">
            Faculty Leave Requests
          </h2>
          {filteredLeaves.length > 0 ? (
            renderLeaveTable()
          ) : (
            <p className="text-gray-300">No faculty leave requests found.</p>
          )}
        </div>
      )}
    </div>
  );
}
