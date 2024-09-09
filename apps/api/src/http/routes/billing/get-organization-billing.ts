import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getOrganizationBilling(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/billing',
      {
        schema: {
          summary: 'Get billing information from organization',
          tags: ['billing'],
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
              billing: z.object({
                seats: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                projects: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                total: z.number(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()

        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Billing')) {
          throw new Error(
            'You are not allowed to get billing information from this organization.',
          )
        }

        const [amountOfMembers, amountOfProject] = await Promise.all([
          prisma.member.count({
            where: {
              organizationId: organization.id,
              role: { not: 'BILLING' },
            },
          }),

          prisma.project.count({
            where: {
              organizationId: organization.id,
            },
          }),
        ])

        const billing = {
          seats: {
            amount: amountOfMembers,
            unit: 10,
            price: amountOfMembers * 10,
          },
          projects: {
            amount: amountOfProject,
            unit: 10,
            price: amountOfProject * 10,
          },
          total: amountOfMembers * 10 + amountOfProject * 10,
        }

        return reply.status(200).send({ billing })
      },
    )
}
