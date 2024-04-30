import { roleSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          summary: 'Get organization membership',
          tags: ['organizations'],
          params: z.object({
            slug: z.string(),
          }),
          security: [
            {
              bearerAuth: [],
            },
          ],
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().cuid(),
                role: roleSchema,
                organizationId: z.string().cuid(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const { membership } = await request.getUserMembership(slug)

        return reply.status(200).send({
          membership: {
            id: membership.id,
            role: roleSchema.parse(membership.role),
            organizationId: membership.organizationId,
          },
        })
      },
    )
}
