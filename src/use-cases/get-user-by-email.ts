import {
  GetUserByEmailParams,
  PostgresGetUserByEmailRepository,
} from '../repositories/postgres/get-user-by-email'

export interface GetUserByEmailResponse {
  id: string
  first_name: string
  last_name: string
  email: string
}

export const GetUserByEmailUseCase = {
  execute: async ({ email }: GetUserByEmailParams) => {
    const user = await PostgresGetUserByEmailRepository.execute({ email })
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    return user as GetUserByEmailResponse
  },
}
