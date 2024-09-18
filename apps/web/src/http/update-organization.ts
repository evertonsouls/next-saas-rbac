import { api } from './api-client'

interface UpdateOrganizationRequest {
  org: string
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type UpdateOrganizationResponse = void

export async function updateOrganization(
  data: UpdateOrganizationRequest,
): Promise<UpdateOrganizationResponse> {
  const { org, name, domain, shouldAttachUsersByDomain } = data

  await api.put(`organizations/${org}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
