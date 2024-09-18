'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth/auth'
import { createProject } from '@/http/create-project'

const projectSchema = z.object({
  name: z.string().min(4, { message: 'Please include at least 4 characters' }),
  description: z.string().nullable().default(null),
})

export async function createProjectAction(data: FormData) {
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const org = getCurrentOrg()

  if (org === null) {
    return {
      success: false,
      message: 'You need to be logged in to create a project',
      errors: null,
    }
  }

  const { name, description } = result.data

  try {
    await createProject({
      org,
      name,
      description,
    })
    return {
      success: true,
      message: 'Successfully saved the project',
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
