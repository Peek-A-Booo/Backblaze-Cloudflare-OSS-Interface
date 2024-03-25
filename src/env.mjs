import { z } from 'zod'

import { createEnv } from '@t3-oss/env-nextjs'

// https://env.t3.gg/docs/nextjs
export const env = createEnv({
  server: {
    APP_KEY_ID: z.string().min(1),
    APP_KEY: z.string().min(1),
    BUCKET_ID: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_HOSTNAME: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_HOSTNAME: process.env.NEXT_PUBLIC_HOSTNAME,
  },
})
