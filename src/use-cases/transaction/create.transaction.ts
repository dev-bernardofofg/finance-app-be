import { v4 as uuidv4 } from 'uuid'
import { UserNotFoundError } from '../../errors/user'
import {
  IPostgresCreateTransactionRepository,
  IPostgresGetUserByIdRepository,
} from '../../repositories/postgres'
import {
  ITransactionParams,
  ITransactionResponse,
} from '../../types/transaction.type'

export interface ICreateTransactionUseCase {
  execute(
    createTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse>
}

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  private createTransactionRepository: IPostgresCreateTransactionRepository
  private getUserByIdRepository: IPostgresGetUserByIdRepository

  constructor(
    createTransactionRepository: IPostgresCreateTransactionRepository,
    getUserByIdRepository: IPostgresGetUserByIdRepository,
  ) {
    this.createTransactionRepository = createTransactionRepository
    this.getUserByIdRepository = getUserByIdRepository
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

    const transactionId = uuidv4()
    const payload = {
      ...createTransactionParams,
      id: transactionId,
    }

    const createdTransaction =
      await this.createTransactionRepository.execute(payload)

    return createdTransaction
  }
}
