'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signUp } from '@/http/sign-up'

const signUpSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please, provide your full name',
    }),
    email: z
      .string({
        required_error: 'Please, provide your email',
      })
      .email({
        message: 'Please enter a valid email address',
      }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters',
    }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords must match',
  })

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, email, password } = result.data

  try {
    await signUp({
      name,
      email,
      password,
    })
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
