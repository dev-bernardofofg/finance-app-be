import { UserNotFoundError } from '../../errors/user'
import { IPostgresGetUserByIdRepository } from '../../repositories/postgres'
import {
  GetBalanceUserParams,
  GetBalanceUserResponse,
  IGetBalanceUserRepository,
} from '../../repositories/postgres/user/get-balance.user'

export interface IGetBalanceUserUseCase {
  execute(params: GetBalanceUserParams): Promise<GetBalanceUserResponse>
}

export class GetBalanceUserUseCase implements IGetBalanceUserUseCase {
  private getBalanceUserRepository: IGetBalanceUserRepository
  private getUserByIdRepository: IPostgresGetUserByIdRepository
  constructor(
    getBalanceUserRepository: IGetBalanceUserRepository,
    getUserByIdRepository: IPostgresGetUserByIdRepository,
  ) {
    this.getBalanceUserRepository = getBalanceUserRepository
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(params: GetBalanceUserParams): Promise<GetBalanceUserResponse> {
    const user = await this.getUserByIdRepository.execute({ id: params.id })
    if (!user) {
      throw new UserNotFoundError(params.id)
    }

    const balance = await this.getBalanceUserRepository.execute(params)

    return balance
  }
}
