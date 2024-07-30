import { projectSchema } from '@saas/auth/src/models/project'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['projects'],
          summary: 'Get project details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {},
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const { orgSlug, projectSlug } = request.params
        const { organization, membership } =
          await request.getUserMembership(orgSlug)

        const project = await prisma.project.findUnique({
          where: {
            slug: projectSlug,
            organizationId: organization.id,
          },
        })

        if (!project) {
          throw new UnauthorizedError(`Project not found`)
        }

        const { cannot } = getUserPermissions(userId, membership.role)
        const authProject = projectSchema.parse(project)

        if (cannot('get', authProject)) {
          throw new UnauthorizedError(`You're not allowed to see this project`)
        }

        return reply.status(200).send({
          project,
        })
      },
    )
}
