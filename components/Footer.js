"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Example: check if token exists in localStorage (you can change based on your auth method)
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <footer className="bg-[#444f45] text-[#e5eddf] py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-[#93b874]">EduLMS</h1>
          <p className="mt-3 text-sm text-[#e5eddf] leading-relaxed">
            Empowering students and teachers with next-gen learning management
            solutions. Modern, scalable, and easy to use.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-white">Quick Links</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-[#93b874] transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-[#93b874] transition">
                Features
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#93b874] transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#93b874] transition">
                Contact
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Account */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1 }}
          >
            <h2 className="text-lg font-semibold mb-4 text-white">Account</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/signin"
                  className="hover:text-[#93b874] transition"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-[#93b874] transition"
                >
                  Login
                </Link>
              </li>
            </ul>
          </motion.div>
        )}

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.3 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-white">
            Stay Updated
          </h2>
          <p className="text-sm text-[#e5eddf] mb-3">
            Subscribe to our newsletter for the latest updates and announcements.
          </p>
          <form className="flex items-center bg-[#282829] rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 bg-transparent text-sm text-white focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#93b874] px-4 py-2 text-sm text-[#282829] font-semibold hover:bg-[#e5eddf] hover:text-[#282829] transition"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#e5eddf]/20 mt-10 pt-6 px-6 flex flex-col md:flex-row items-center justify-between text-sm text-[#e5eddf]">
        <p>© {new Date().getFullYear()} EduLMS. All rights reserved.</p>
        <div className="flex space-x-5 mt-4 md:mt-0">
          <a href="#" className="hover:text-[#93b874] transition">
            <Facebook size={18} />
          </a>
          <a href="#" className="hover:text-[#93b874] transition">
            <Twitter size={18} />
          </a>
          <a href="#" className="hover:text-[#93b874] transition">
            <Instagram size={18} />
          </a>
          <a href="#" className="hover:text-[#93b874] transition">
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:info@edulms.com"
            className="hover:text-[#93b874] transition"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
