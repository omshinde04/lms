"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Info,
  Phone,
  Star,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  Pencil,
  FileText,
  BookOpen,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  // Detect scroll for shrink effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
      setRole(decoded.role || "student");
    } catch {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setRole(null);
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Home", icon: <Home size={20} />, href: "/" },
    { name: "Features", icon: <Star size={20} />, href: "/features" },
    { name: "About", icon: <Info size={20} />, href: "/about" },
    { name: "Contact", icon: <Phone size={20} />, href: "/contact" },
  ];

  // 🔹 Dashboard route based on role
  const getDashboardRoute = () => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "faculty") return "/dashboard/faculty";
    return "/dashboard/student";
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 bg-gradient-to-r from-[#93b874] via-[#444f45] to-[#ffd200] shadow-lg"
          : "py-4 bg-gradient-to-r from-[#93b874]/80 via-[#444f45]/80 to-[#ffd200]/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-white font-extrabold text-2xl tracking-wide"
        >
          LeaveDesk
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-white font-medium items-center">
          {navItems.map((item) => (
            <li
              key={item.name}
              className="group relative cursor-pointer flex items-center gap-1"
            >
              {item.icon}
              <Link href={item.href} className="hover:text-[#ffd200] transition">
                {item.name}
              </Link>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#ffd200] transition-all group-hover:w-full"></span>
            </li>
          ))}

          {!isAuthenticated ? (
            <>
              <li>
                <Link
                  href="/signin"
                  className="px-5 py-2 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-transparent border border-[#ffd200] text-white hover:bg-[#ffd200] hover:text-[#282829] flex items-center gap-2"
                >
                  <UserPlus size={18} /> Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="bg-[#ffd200] text-[#282829] px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                >
                  <LogIn size={18} /> Login
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* Student-only Apply Exam Leave button */}
              {role === "student" && (
                <li>
                  <Link
                    href="/dashboard/student/exam-leave"
                    className="bg-[#ffd200] text-[#282829] px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                  >
                    <FileText size={18} /> Exam Leave
                  </Link>
                </li>
              )}

              {/* Faculty-only Apply Leave button */}
              {role === "faculty" && (
                <li>
                  <Link
                    href="/dashboard/faculty/apply-leave"
                    className="bg-[#ffd200] text-[#282829] px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                  >
                    <Pencil size={18} /> Apply Leave
                  </Link>
                </li>
              )}

              {/* Faculty-only Exam Leaves button */}
              {role === "faculty" && (
                <li>
                  <Link
                    href="/dashboard/faculty/exam-leaves"
                    className="bg-[#ffd200] text-[#282829] px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                  >
                    <BookOpen size={18} /> Exam Leaves
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href={getDashboardRoute()}
                  className="px-5 py-2 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-transparent border border-[#ffd200] text-white hover:bg-[#ffd200] hover:text-[#282829] flex items-center gap-2"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white transition-transform duration-300"
          >
            {isOpen ? (
              <X size={28} className="animate-spin" />
            ) : (
              <Menu size={28} className="animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Fullscreen overlay */}
      <div
        className={`fixed top-0 left-0 h-screen w-screen bg-gradient-to-br from-[#93b874] via-[#444f45] to-[#ffd200] text-white transform transition-transform duration-500 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button inside fullscreen menu */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-white"
        >
          <X size={30} />
        </button>

        <div className="flex flex-col items-center justify-center h-full space-y-8 text-2xl font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 hover:text-black hover:bg-[#ffd200] px-6 py-2 rounded-lg transition"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          {!isAuthenticated ? (
            <>
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="w-48 px-6 py-3 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-transparent border border-[#ffd200] text-white hover:bg-[#ffd200] hover:text-[#282829] flex items-center justify-center gap-2"
              >
                <UserPlus size={20} /> Sign In
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-48 bg-[#ffd200] text-[#282829] px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
              >
                <LogIn size={20} /> Login
              </Link>
            </>
          ) : (
            <>
              {/* Student-only Apply Exam Leave button */}
              {role === "student" && (
                <Link
                  href="/dashboard/student/exam-leave" // ✅ fixed path
                  onClick={() => setIsOpen(false)}
                  className="w-48 px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 
                             transition-transform duration-300 flex items-center justify-center gap-2
                             bg-[#ffd200] text-[#282829]"
                >
                  <FileText size={20} />  Exam Leave
                </Link>
              )}

              {/* Faculty-only Apply Leave button */}
              {role === "faculty" && (
                <Link
                  href="/dashboard/faculty/apply-leave"
                  onClick={() => setIsOpen(false)}
                  className="w-48 px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 
                             transition-transform duration-300 flex items-center justify-center gap-2
                             bg-[#ffd200] text-[#282829]"
                >
                  <Pencil size={20} /> Apply Leave
                </Link>
              )}

              {/* Faculty-only Exam Leaves button */}
              {role === "faculty" && (
                <Link
                  href="/dashboard/faculty/exam-leaves"
                  onClick={() => setIsOpen(false)}
                  className="w-48 px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 
                             transition-transform duration-300 flex items-center justify-center gap-2
                             bg-[#ffd200] text-[#282829]"
                >
                  <BookOpen size={20} /> Exam Leaves
                </Link>
              )}

              <Link
                href={getDashboardRoute()}
                onClick={() => setIsOpen(false)}
                className="w-48 px-6 py-3 rounded-lg font-semibold shadow-md transition-transform duration-300 hover:scale-105 bg-transparent border border-[#ffd200] text-white hover:bg-[#ffd200] hover:text-[#282829] flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-48 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
