'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { COOKIES_TOKEN } from '@/constants/auth.constants'
import { acceptInvite } from '@/http/accept-invite'
import { signInWithPassword } from '@/http/sign-in-with-password'

const signInSchema = z.object({
  email: z
    .string({
      required_error: 'Please, provide your email',
    })
    .email({
      message: 'Please enter a valid email address',
    }),
  password: z
    .string({
      required_error: 'Please, provide your password',
    })
    .min(1, {
      message: 'Please, provide your password',
    }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    cookies().set(COOKIES_TOKEN, token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    const inviteId = cookies().get('inviteId')?.value

    if (inviteId) {
      try {
        await acceptInvite(inviteId)
        cookies().delete('inviteId')
      } catch (e) {
        console.log(e)
      }
    }

    return {
      success: true,
      message: null,
      errors: null,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    }
  }
}
