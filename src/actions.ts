'use server'

import { cookies } from 'next/headers'

import { env } from '@/env.mjs'

export async function setAccessCode(code: string) {
  if (!env.ACCESS_CODE || code !== env.ACCESS_CODE) {
    cookies().delete('Access-Code')
    return false
  }

  cookies().set('Access-Code', code)
  return true
}
