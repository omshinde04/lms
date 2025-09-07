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
            The <span className="text-[#ffd200] font-semibold">Leave Management System (LeaveDesk)</span> 
            is designed to simplify and digitize the process of applying for and approving leave 
            in a college environment. Traditionally, leave applications are handled manually on paper, 
            which often leads to inefficiencies, lack of transparency, and difficulties in maintaining 
            accurate records.
          </p>
          <p className="text-gray-400 leading-relaxed mb-8">
            LeaveDesk provides a centralized online platform where{" "}
            <span className="text-[#93b874] font-medium">students</span>,{" "}
            <span className="text-[#93b874] font-medium">faculty</span>, and{" "}
            <span className="text-[#93b874] font-medium">administrators</span> 
            can manage leave requests seamlessly. This system enhances efficiency, ensures better 
            tracking of attendance, improves transparency in approvals, and reduces paperwork — 
            making the leave process faster, smarter, and more reliable.
          </p>
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

      {/* Team Section */}
      <div className="mt-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-[#ffd200] mb-12">
          👩‍💻 Meet Our Team
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Nutan Khandave",
              role: "Frontend Developer",
              desc: "Built the responsive UI/UX using Next.js and Tailwind CSS, ensuring accessibility and smooth user interactions.",
            },
            {
              name: "Jayshree Patil",
              role: "Backend Developer",
              desc: "Developed APIs and authentication system with Node.js, Next.js API routes, and MongoDB integration.",
            },
            {
              name: "Ketakee Patil",
              role: "Database & Deployment",
              desc: "Handled MongoDB schema design, database operations, and deployment management using Vercel.",
            },
            {
              name: "Tanaya Patil",
              role: "Project Lead & Tester",
              desc: "Coordinated project workflow, managed version control on GitHub, and performed end-to-end testing for quality assurance.",
            },
            {
              name: "P.D. Jadhav",
              role: "HOD",
              desc: "Provided guidance and supervision throughout the project development, ensuring alignment with academic standards.",
            },
            {
              name: "Prof. Sonali Vidhate",
              role: "CC",
              desc: "Supported and monitored project progress, providing valuable feedback and mentoring the team.",
            },
          ].map((member, idx) => (
            <motion.div
              key={idx}
              className="p-6 bg-gray-800 rounded-2xl shadow-md hover:-translate-y-2 transition-transform"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-[#ffd200]">{member.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{member.role}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{member.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
