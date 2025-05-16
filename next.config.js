/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      appDir: true
    },
    images: {
      domains: ['picsum.photos'],
    },
  }
  // ✅ Aktifkan middleware hanya di /dashboard
  matcher: ["/admin/:path*"],
  
  
  module.exports = nextConfig