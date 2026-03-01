import { UserNotFoundError } from '../../errors/user'
import {
  GetTransactionByUserIdParams,
  IPostgresGetTransactionByUserIdRepository,
  IPostgresGetUserByIdRepository,
} from '../../repositories/postgres'
import { ITransactionResponse } from '../../types'

export interface IGetTransactionByUserIdUseCase {
  execute(params: GetTransactionByUserIdParams): Promise<ITransactionResponse[]>
}

export class GetTransactionByUserIdUseCase implements IGetTransactionByUserIdUseCase {
  private getTransactionByUserIdRepository: IPostgresGetTransactionByUserIdRepository
  private getUserByIdRepository: IPostgresGetUserByIdRepository
  constructor(
    getTransactionByUserIdRepository: IPostgresGetTransactionByUserIdRepository,
    getUserByIdRepository: IPostgresGetUserByIdRepository,
  ) {
    this.getTransactionByUserIdRepository = getTransactionByUserIdRepository
    this.getUserByIdRepository = getUserByIdRepository
  }
  async execute(
    params: GetTransactionByUserIdParams,
  ): Promise<ITransactionResponse[]> {
    const user = await this.getUserByIdRepository.execute({ id: params.userId })

    if (!user) {
      throw new UserNotFoundError(params.userId)
    }

    return await this.getTransactionByUserIdRepository.execute(params.userId)
  }
}
