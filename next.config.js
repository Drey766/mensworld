/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from Supabase storage and placeholder services
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

module.exports = nextConfig;
