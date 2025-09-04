import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LeaveDesk",
  description: "LeaveDesk - Smart leave management for students, faculty, and HOD",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon1.png", // Default app icon
    apple: [
      { url: "/icons/icon1.png", sizes: "180x180", type: "image/png" }, // iOS
      { url: "/icons/icon1.png", sizes: "192x192", type: "image/png" }, // Android
      { url: "/icons/icon1.png", sizes: "512x512", type: "image/png" }, // Splash screen
    ],
  },
};

export const viewport = {
  themeColor: "#0d6efd",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d6efd" />

        {/* iOS specific */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon1.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon1.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon1.png" />

        {/* ✅ iOS app name */}
        <meta name="apple-mobile-web-app-title" content="LeaveDesk" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
