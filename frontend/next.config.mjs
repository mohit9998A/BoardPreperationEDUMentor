/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  /* API proxy to avoid CORS in development */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;

