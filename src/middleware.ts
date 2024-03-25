import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { env } from '@/env.mjs'

export function middleware(request: NextRequest) {
  const pathname = request.url.split('/').at(-1)

  if (env.ACCESS_CODE) {
    const accessCode = request.cookies.get('Access-Code')

    if (!accessCode?.value || env.ACCESS_CODE !== accessCode.value) {
      if (pathname !== 'login') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } else if (pathname === 'login') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } else if (pathname === 'login') {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/', '/login'],
}
