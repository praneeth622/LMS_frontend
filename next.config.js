/** @type {import('next').NextConfig} */
const nextConfig = {
  // Moved from experimental to root level in Next.js 15
  serverExternalPackages: ['@supabase/supabase-js'],
  experimental: {
    // serverComponentsExternalPackages deprecated, moved above
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable during modernization
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: false,
    domains: ['localhost', 'eduflow.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;