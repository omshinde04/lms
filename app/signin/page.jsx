"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student", // default role
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role, // send role
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong!");
      } else {
        setMessage("✅ Account created successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (error) {
      setMessage("❌ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 p-8"
      >
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#ffd200] to-[#93b874] bg-clip-text text-transparent"
        >
          Create Account
        </motion.h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffd200] transition"
            />
          </motion.div>

          {/* Email */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93b874] transition"
            />
          </motion.div>

          {/* Password */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffd200] transition"
            />
          </motion.div>

          {/* Role Dropdown */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <label className="block text-sm text-gray-300 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#93b874] transition"
            >
              <option value="student" className="bg-gray-800 text-white">
                Student
              </option>
              <option value="faculty" className="bg-gray-800 text-white">
                Faculty
              </option>
            </select>
          </motion.div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#ffd200] to-[#93b874] text-black font-semibold rounded-xl shadow-lg hover:brightness-110 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Message */}
        {message && <p className="text-center text-sm mt-4 text-gray-300">{message}</p>}

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#ffd200] hover:underline font-medium">
            Log In
          </a>
        </motion.p>
      </motion.div>
    </section>
  );
}
