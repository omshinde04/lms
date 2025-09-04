import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = withPWA({
  dest: "public",
  disable: isDev,  // 👈 disable PWA in dev mode
  register: true,
  skipWaiting: true,
})({
  reactStrictMode: true,
});

export default nextConfig;
