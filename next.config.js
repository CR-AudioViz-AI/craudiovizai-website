/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['kteobfyferrukqeolofj.supabase.co'],
  },
}

module.exports = nextConfig
