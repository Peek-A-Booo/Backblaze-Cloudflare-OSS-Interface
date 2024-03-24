import { env } from '@/env.mjs'
import { Redis, SetCommandOptions } from '@upstash/redis'

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL || '',
  token: env.UPSTASH_REDIS_REST_TOKEN || '',
})

export const getRedisValue = async (key: string): Promise<string> => {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const value = await redis.get(key)
    return (value as string) || ''
  } else {
    return ''
  }
}

export const setRedisValue = async (
  key: string,
  value: string,
  options?: SetCommandOptions,
): Promise<void> => {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    await redis.set(key, value, options)
  }
}
