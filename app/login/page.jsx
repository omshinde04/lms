"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student"); // default role

  // 🔹 Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      // Check expiry
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return;
      }

      // Redirect if already logged in
      if (decoded.role === "admin") {
        window.location.href = "/dashboard/admin";
      } else if (decoded.role === "faculty") {
        window.location.href = "/dashboard/faculty";
      } else {
        window.location.href = "/dashboard/student";
      }
    } catch (err) {
      localStorage.removeItem("token");
    }
  }, []);

  // 🔹 Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed ❌");
        return;
      }

      alert("✅ Login successful!");
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (role === "admin") {
        window.location.href = "/dashboard/admin";
      } else if (role === "faculty") {
        window.location.href = "/dashboard/faculty";
      } else {
        window.location.href = "/dashboard/student";
      }
    } catch (err) {
      console.error(err);
      alert("Server error, please try again.");
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
          Welcome Back
        </motion.h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#93b874] transition"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffd200] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9 text-gray-400 hover:text-[#ffd200] transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>

          {/* Role Dropdown */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm text-gray-300 mb-1">
              Login as
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#93b874] transition"
            >
              <option value="student" className="bg-gray-900">
                Student
              </option>
              <option value="faculty" className="bg-gray-900">
                Faculty
              </option>
              <option value="admin" className="bg-gray-900">
                Admin
              </option>
            </select>
          </motion.div>

          {/* Forgot Password */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-end"
          >
            <a
              href="#"
              className="text-sm text-[#93b874] hover:underline transition"
            >
              Forgot Password?
            </a>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#ffd200] to-[#93b874] text-black font-semibold rounded-xl shadow-lg hover:brightness-110 transition"
          >
            Log In
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-400 text-sm text-center mt-6"
        >
          Don’t have an account?{" "}
          <a
            href="/signin"
            className="text-[#ffd200] hover:underline font-medium"
          >
            Sign Up
          </a>
        </motion.p>
      </motion.div>
    </section>
  );
}
