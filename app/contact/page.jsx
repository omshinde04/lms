"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully 🚀");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white pt-32 pb-20 px-6 lg:px-20">
      {/* Hero Heading */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-20"
      >
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#ffd200] to-[#93b874] bg-clip-text text-transparent">
          Let’s Get in Touch
        </h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Have a project in mind or want to collaborate? Fill out the form below
          or reach out through our contact details. We’d love to hear from you.
        </p>
      </motion.div>

      {/* Main Contact Section */}
      <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
        {/* Left - Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-[#ffd200]/50 transition">
            <div className="flex items-center space-x-4">
              <Mail className="text-[#ffd200]" size={32} />
              <p className="text-lg text-gray-200">support@example.com</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-[#93b874]/50 transition">
            <div className="flex items-center space-x-4">
              <Phone className="text-[#93b874]" size={32} />
              <p className="text-lg text-gray-200">+91 9876543210</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-[#ff6363]/50 transition">
            <div className="flex items-center space-x-4">
              <MapPin className="text-[#ff6363]" size={32} />
              <p className="text-lg text-gray-200">Pune, Maharashtra, India</p>
            </div>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex space-x-8 pt-6"
          >
            <a
              href="#"
              className="text-gray-400 hover:text-[#ffd200] transition"
            >
              <Facebook size={32} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#93b874] transition"
            >
              <Twitter size={32} />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#444f45] transition"
            >
              <Linkedin size={32} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right - Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl rounded-3xl p-10"
        >
          <h3 className="text-3xl font-bold mb-8 text-[#ffd200]">
            Send a Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-[#ffd200] transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-[#93b874] transition"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-[#ff6363] transition"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex items-center justify-center w-full px-6 py-4 text-lg font-semibold text-white bg-[#ffd200] hover:bg-[#e6c200] rounded-xl shadow-md transition"
            >
              Send Message <Send className="ml-2" size={22} />
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mt-24 rounded-3xl overflow-hidden shadow-2xl max-w-7xl mx-auto"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.149656456749!2d73.856743!3d18.520430!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0e9b9d3bfb1%3A0xdaa0a7b774b8eb76!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </motion.div>
    </section>
  );
}
