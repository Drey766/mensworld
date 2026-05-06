/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // ASOS CDN — 490 seed products
        protocol: "https",
        hostname: "images.asos-media.com",
      },
      {
        // Unsplash — blog cover images
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Placeholder images
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

module.exports = nextConfig;
