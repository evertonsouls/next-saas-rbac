import { api } from './api-client'

interface GetProjectsResponse {
  projects: {
    id: string
    slug: string
    description: string
    name: string
    ownerId: string
    avatarUrl: string | null
    organizationId: string
    createdAt: string
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
  }[]
}

export async function getProjects(org: string): Promise<GetProjectsResponse> {
  const result = await api
    .get(`organizations/${org}/projects`)
    .json<GetProjectsResponse>()

  return result
}
