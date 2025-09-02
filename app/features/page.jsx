"use client";
import { motion } from "framer-motion";
import { FaRocket, FaMobileAlt, FaShieldAlt, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: <FaRocket className="text-5xl text-[#ffd200]" />,
    title: "Blazing Fast",
    description:
      "Experience lightning-fast load times and buttery-smooth interactions with optimized performance.",
  },
  {
    icon: <FaMobileAlt className="text-5xl text-[#93b874]" />,
    title: "Fully Responsive",
    description:
      "Our design adapts seamlessly across all devices, ensuring great user experiences everywhere.",
  },
  {
    icon: <FaShieldAlt className="text-5xl text-[#ff6363]" />,
    title: "Secure by Design",
    description:
      "Security is built into every layer, keeping your data safe and private.",
  },
  {
    icon: <FaUsers className="text-5xl text-[#444f45]" />,
    title: "User Friendly",
    description:
      "An intuitive interface that makes everything simple, clean, and enjoyable to use.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 pt-32 pb-20">
      {/* Heading */}
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#ffd200] to-[#93b874] bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🚀 Our Features
      </motion.h1>
      <motion.p
        className="text-center text-lg text-gray-300 max-w-2xl mx-auto mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Designed with performance, security, and elegance in mind — here’s what
        makes our platform stand out.
      </motion.p>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl shadow-xl hover:shadow-[#ffd200]/50 hover:-translate-y-2 transition-all duration-300"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="mb-6 flex justify-center">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-center mb-3 text-[#ffd200]">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
