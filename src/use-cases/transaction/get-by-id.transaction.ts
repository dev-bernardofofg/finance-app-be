import { TransactionNotFoundError } from '@/errors/transaction'
import { IPostgresGetTransactionByIdRepository } from '@/repositories/postgres'
import { ITransactionResponse } from '@/types'

export interface IGetTransactionByIdUseCase {
  execute(
    transactionId: string,
    userId: string,
  ): Promise<ITransactionResponse | null>
}

export class GetTransactionByIdUseCase implements IGetTransactionByIdUseCase {
  private getTransactionByIdRepository: IPostgresGetTransactionByIdRepository
  constructor(
    getTransactionByIdRepository: IPostgresGetTransactionByIdRepository,
  ) {
    this.getTransactionByIdRepository = getTransactionByIdRepository
  }
  async execute(
    transactionId: string,
    userId: string,
  ): Promise<ITransactionResponse | null> {
    const transaction = await this.getTransactionByIdRepository.execute({
      transactionId,
    })

    if (!transaction || transaction.user_id !== userId) {
      throw new TransactionNotFoundError(transactionId)
    }

    return transaction
  }
}
