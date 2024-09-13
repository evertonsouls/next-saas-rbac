import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/get-profile'

export const COOKIES_TOKEN = '@saas-rbac/token'

export function isAuthenticated() {
  return !!cookies().get(COOKIES_TOKEN)?.value
}

export async function auth() {
  const token = cookies().get(COOKIES_TOKEN)?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch (err) {
    console.error(err)
  }

  redirect('/api/auth/sign-out')
}
