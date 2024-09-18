import { api } from './api-client'

interface CreateProjectRequest {
  org: string
  name: string
  description: string | null
}

type CreateProjectResponse = void

export async function createProject(
  data: CreateProjectRequest,
): Promise<CreateProjectResponse> {
  const { name, description, org } = data

  await api.post(`organizations/${org}/projects`, {
    json: {
      name,
      description,
    },
  })
}
