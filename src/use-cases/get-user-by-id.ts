import { UserNotFoundError } from '../errors/user'
import {
  GetUserByIdParams,
  PostgresGetUserByIdRepository,
} from '../repositories/postgres/get-user-by-id'

export interface GetUserByIdResponse {
  id: string
  first_name: string
  last_name: string
  email: string
}

export const GetUserByIdUseCase = {
  execute: async ({ id }: GetUserByIdParams) => {
    const user = await PostgresGetUserByIdRepository.execute({ id })
    if (!user) {
      throw new UserNotFoundError(id)
    }
    return user as GetUserByIdResponse
  },
}
