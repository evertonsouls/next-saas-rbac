import { api } from './api-client'

interface SignInWithPasswordRequest {
  email: string
  password: string
}

interface SignInWithPasswordResponse {
  token: string
}

export async function signInWithPassword(
  data: SignInWithPasswordRequest,
): Promise<SignInWithPasswordResponse> {
  const { email, password } = data

  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<SignInWithPasswordResponse>()

  return result
}
