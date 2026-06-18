/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Plain <img> tags + Supabase public URLs — no next/image optimizer needed on the Pi5.
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
