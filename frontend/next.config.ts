import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   async rewrites() {
        return [
          {
            source: 'api/:path*",
            destination: " https://interviewprep-ir1z.onrender.com"
          }
        ]
   }
};

export default nextConfig;
