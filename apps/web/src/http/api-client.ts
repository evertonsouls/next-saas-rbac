import { getCookie } from 'cookies-next'
import type { CookiesFn } from 'cookies-next/lib/types'
import ky from 'ky'

import { COOKIES_TOKEN } from '@/auth/auth'

const api = ky.extend({
  prefixUrl: 'http://localhost:3333',
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookieStore: CookiesFn | undefined

        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')
          cookieStore = serverCookies
        }

        const token = getCookie(COOKIES_TOKEN, { cookies: cookieStore })

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
})

export { api }
