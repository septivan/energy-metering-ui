/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Output configuration for Vercel
  output: 'standalone',
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Optimize images (if you add images later)
  images: {
    domains: [], // Add your image domains here if needed
    formats: ['image/webp'],
  },
  
  // Environment variables (automatically passed to client)
  env: {
    NEXT_PUBLIC_QUERY_API_URL: process.env.NEXT_PUBLIC_QUERY_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    NEXT_PUBLIC_WS_RECONNECT_DELAY: process.env.NEXT_PUBLIC_WS_RECONNECT_DELAY,
    NEXT_PUBLIC_WS_MAX_RETRIES: process.env.NEXT_PUBLIC_WS_MAX_RETRIES,
    NEXT_PUBLIC_POLLING_INTERVAL: process.env.NEXT_PUBLIC_POLLING_INTERVAL,
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;
