/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'your-supabase-project.supabase.co',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com'
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'CR AudioViz AI',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig
