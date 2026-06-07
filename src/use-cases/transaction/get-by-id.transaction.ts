import { TransactionNotFoundError } from '@/errors/transaction'
import { IPostgresGetTransactionByIdRepository } from '@/repositories/postgres'
import { ITransactionResponse } from '@/types'

export interface IGetTransactionByIdUseCase {
  execute(
    transactionId: string,
    user_id: string,
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
    user_id: string,
  ): Promise<ITransactionResponse | null> {
    const transaction = await this.getTransactionByIdRepository.execute({
      transactionId,
    })

    if (!transaction || transaction.user_id !== user_id) {
      throw new TransactionNotFoundError(transactionId)
    }

    return transaction
  }
}
