import { IdGeneratorAdapter } from '../../adapters'
import { UserNotFoundError } from '../../errors/user'
import {
  IPostgresCreateTransactionRepository,
  IPostgresGetUserByIdRepository,
} from '../../repositories/postgres'
import { ITransactionParams, ITransactionResponse } from '../../types'

export interface ICreateTransactionUseCase {
  execute(
    createTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse>
}

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  private createTransactionRepository: IPostgresCreateTransactionRepository
  private getUserByIdRepository: IPostgresGetUserByIdRepository
  private idGeneratorAdapter: IdGeneratorAdapter
  constructor(
    createTransactionRepository: IPostgresCreateTransactionRepository,
    getUserByIdRepository: IPostgresGetUserByIdRepository,
    idGeneratorAdapter: IdGeneratorAdapter,
  ) {
    this.createTransactionRepository = createTransactionRepository
    this.getUserByIdRepository = getUserByIdRepository
    this.idGeneratorAdapter = idGeneratorAdapter
  }

  async execute(
    createTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse> {
    const user = await this.getUserByIdRepository.execute({
      id: createTransactionParams.user_id,
    })
    if (!user) {
      throw new UserNotFoundError(createTransactionParams.user_id)
    }

    const transactionId = await this.idGeneratorAdapter.execute()
    const payload = {
      ...createTransactionParams,
      id: transactionId,
    }

    const createdTransaction =
      await this.createTransactionRepository.execute(payload)

    return createdTransaction
  }
}
