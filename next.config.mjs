/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/du7jms9wb/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
