import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ✅ Aktifkan middleware hanya di /dashboard
  matcher: ["/admin/:path*"],
  images: {
    domains: ['picsum.photos'],
  },
};

export default nextConfig;