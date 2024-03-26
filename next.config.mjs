import { env } from './src/env.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: env.NEXT_PUBLIC_HOSTNAME || '*',
      },
    ],
  },
}

export default nextConfig
