/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
          {
            source: "/api/:path*",
            headers: [
              {
                key: "Access-Control-Allow-Origin",
                value: "https://discophiles.vercel.app", // Set your origin
              },
              {
                key: "Access-Control-Allow-Methods",
                value: "GET, POST, PUT, DELETE, OPTIONS",
              },
              {
                key: "Access-Control-Allow-Headers",
                value: "Content-Type, Authorization",
              },
            ],
          },
        ];
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '8pi4gfrln9bquwem.public.blob.vercel-storage.com',
          },
        ],
      },
};

export default nextConfig;


