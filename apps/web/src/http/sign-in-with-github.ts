import { api } from './api-client'

interface SignInWithGithubRequest {
  code: string
}

interface SignInWithGithubResponse {
  token: string
}

export async function signInWithGithub(
  data: SignInWithGithubRequest,
): Promise<SignInWithGithubResponse> {
  const { code } = data

  const result = await api
    .post('sessions/github', {
      json: {
        code,
      },
    })
    .json<SignInWithGithubResponse>()

  return result
}
