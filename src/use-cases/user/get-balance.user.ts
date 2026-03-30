import { UserNotFoundError } from '../../errors/user'
import { IPostgresGetUserByIdRepository } from '../../repositories/postgres'
import {
  GetBalanceUserResponse,
  IGetBalanceUserRepository,
} from '../../repositories/postgres/user/get-balance.user'

export interface IGetBalanceUserUseCase {
  execute(id: string): Promise<GetBalanceUserResponse>
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

  async execute(id: string): Promise<GetBalanceUserResponse> {
    const user = await this.getUserByIdRepository.execute({ id })
    if (!user) {
      throw new UserNotFoundError(id)
    }

    const balance = await this.getBalanceUserRepository.execute({ id })

    return balance
  }
}
