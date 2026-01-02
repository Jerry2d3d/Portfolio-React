/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    // Ensure TypeScript is properly configured
    tsconfigPath: './tsconfig.json',
  },

  // Security headers for production deployment
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Allow eval for Next.js runtime
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Allow Google Fonts
              "font-src 'self' https://fonts.gstatic.com", // Allow Google Fonts
              "img-src 'self' data: blob:", // Allow data URLs and blob URLs for QR codes
              "connect-src 'self'",
              "frame-ancestors 'none'", // Prevent clickjacking
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Prevent clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevent MIME sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
