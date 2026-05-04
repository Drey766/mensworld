/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage — your uploaded product images
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // ASOS CDN — used by the 490 seed products
        protocol: "https",
        hostname: "images.asos-media.com",
      },
      {
        // Placeholder images for dev/demo
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

module.exports = nextConfig;
