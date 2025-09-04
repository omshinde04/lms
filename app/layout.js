import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // 👈 Import Navbar component
import Footer from "../components/Footer"; // 👈 Import Footer component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Leave Management System",
  description: "Leave management system for students, faculty, and HOD",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-512x512.png",
  },
};

// ✅ Move themeColor here instead
export const viewport = {
  themeColor: "#0d6efd",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fallback for browsers that don’t fully support Next.js metadata */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d6efd" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="min-h-screen">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
