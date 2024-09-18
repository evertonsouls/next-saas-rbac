import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { COOKIES_TOKEN } from '@/constants/auth.constants'

export async function GET(request: NextRequest) {
  cookies().delete(COOKIES_TOKEN)

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/auth/sign-in'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}
