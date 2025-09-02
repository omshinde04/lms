"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
      setFaculty(data.faculty || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, role) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("User deleted successfully!");
        if (role === "student") setUsers(users.filter((u) => u._id !== id));
        else setFaculty(faculty.filter((f) => f._id !== id));
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );

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

  const renderTable = (data, roleColor) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-xl shadow-lg">
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
        Admin Dashboard
      </motion.h1>

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
  );
}
