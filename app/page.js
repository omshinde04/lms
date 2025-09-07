"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Users, Trophy, Laptop } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-gradient-to-b from-white to-[#e5eddf]">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 sm:pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-20">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-[#444f45] leading-snug">
            Welcome to <br />
            <span className="text-[#93b874]">
              MET Institute of Engineering
            </span>
            <br />
            Adgaon, Nashik
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0">
            A premier institution shaping the engineers of tomorrow with modern
            learning solutions, industry-ready skills, and holistic development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/signin">
              <button className="bg-[#ffd200] text-[#282829] px-6 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform duration-300">
                Get Started
              </button>
            </Link>
            <Link href="/about">
              <button className="bg-transparent border-2 border-[#93b874] text-[#444f45] px-6 py-3 rounded-xl font-semibold hover:bg-[#93b874] hover:text-white transition-all duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 mt-10 lg:mt-0 flex justify-center"
        >
          <Image
            src="/images/hero.png"
            alt="Education Illustration"
            width={500}
            height={400}
            priority
            className="w-full max-w-xs sm:max-w-md lg:max-w-lg h-auto drop-shadow-xl"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#444f45] mb-12"
          >
            Why Choose MET Institute of Engineering?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: <BookOpen size={36} />,
                title: "Expert Faculty",
                desc: "Learn from highly qualified professors with rich academic and industry experience.",
              },
              {
                icon: <Users size={36} />,
                title: "Student Community",
                desc: "Be part of an active campus culture fostering collaboration and innovation.",
              },
              {
                icon: <Laptop size={36} />,
                title: "Modern Learning",
                desc: "Access smart classrooms, digital resources, and hands-on labs for practical learning.",
              },
              {
                icon: <Trophy size={36} />,
                title: "Proven Excellence",
                desc: "Consistent academic results and placements in top companies worldwide.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-[#e5eddf] rounded-2xl p-6 sm:p-8 shadow-md flex flex-col items-center space-y-4 transition"
              >
                <div className="text-[#93b874]">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#444f45]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-[#93b874] via-[#444f45] to-[#ffd200] py-16 sm:py-20 px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl lg:max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
            Start Your Learning Journey with MET Nashik
          </h2>
          <p className="mb-8 text-base sm:text-lg">
            Join a legacy of excellence and innovation in engineering education.
            Your future begins here at MET Institute of Engineering, Adgaon,
            Nashik.
          </p>
          <Link href="/signin">
            <button className="bg-white text-[#282829] px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform duration-300">
              Join Now
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
