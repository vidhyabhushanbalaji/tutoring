// next.config.js
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', 
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`},
    ]
  },
}

export default nextConfig;


