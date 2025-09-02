"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white px-6 pt-32 pb-20">
      {/* Main About Section */}
      <motion.div
        className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Left Side - Image */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/about.png"
              alt="Leave Management System"
              width={500}
              height={500}
              className="rounded-2xl shadow-2xl border border-[#ffd200]/40"
            />
          </motion.div>
        </motion.div>

        {/* Right Side - Content */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#ffd200] to-[#93b874] bg-clip-text text-transparent">
            About the Project
          </h1>
          <p className="text-gray-300 leading-relaxed mb-6 text-lg">
            The <span className="text-[#ffd200] font-semibold">Leave Management System (LMS)</span> 
            is designed to simplify and digitize the process of applying for and approving leave 
            in a college environment. Traditionally, leave applications are handled manually on paper, 
            which often leads to inefficiencies, lack of transparency, and difficulties in maintaining 
            accurate records.
          </p>
          <p className="text-gray-400 leading-relaxed mb-8">
            Our LMS provides a centralized online platform where{" "}
            <span className="text-[#93b874] font-medium">students</span>,{" "}
            <span className="text-[#93b874] font-medium">faculty</span>, and{" "}
            <span className="text-[#93b874] font-medium">administrators</span> 
            can manage leave requests seamlessly. This system enhances efficiency, ensures better 
            tracking of attendance, improves transparency in approvals, and reduces paperwork — 
            making the leave process faster, smarter, and more reliable.
          </p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[#ffd200] text-black font-semibold rounded-xl shadow-lg hover:shadow-[#ffd200]/50 transition-all"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Mission & Vision Section */}
      <div className="mt-24 grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <motion.div
          className="p-8 bg-gray-800 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-4 text-[#ffd200]">🎯 Our Mission</h2>
          <p className="text-gray-300">
            To eliminate inefficiencies of manual leave applications by 
            building a digital-first platform that is transparent, fast, 
            and accessible to all stakeholders in the academic community.
          </p>
        </motion.div>

        <motion.div
          className="p-8 bg-gray-800 rounded-2xl shadow-lg hover:-translate-y-2 transition-transform"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-4 text-[#93b874]">🌍 Our Vision</h2>
          <p className="text-gray-300">
            To create a smarter, paperless, and fully automated leave management 
            ecosystem that can be scaled beyond colleges, serving organizations 
            and institutions worldwide.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
