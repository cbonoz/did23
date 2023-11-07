/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true, 
    },
    eslint: {
      // ignore eslint during build process
      ignoreDuringBuilds: true,
    },
  }

module.exports = nextConfig
