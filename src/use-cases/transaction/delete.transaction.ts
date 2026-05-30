import { TransactionNotFoundError } from '@/errors/transaction'
import {
  IPostgresDeleteTransactionRepository,
  IPostgresGetTransactionByIdRepository,
} from '@/repositories/postgres'
import { ITransactionResponse } from '@/types'

export interface IDeleteTransactionUseCase {
  execute(
    transactionId: string,
    userId: string,
  ): Promise<ITransactionResponse | null>
}

export class DeleteTransactionUseCase implements IDeleteTransactionUseCase {
  private deleteTransactionRepository: IPostgresDeleteTransactionRepository
  private getTransactionByIdRepository: IPostgresGetTransactionByIdRepository
  constructor(
    deleteTransactionRepository: IPostgresDeleteTransactionRepository,
    getTransactionByIdRepository: IPostgresGetTransactionByIdRepository,
  ) {
    this.deleteTransactionRepository = deleteTransactionRepository
    this.getTransactionByIdRepository = getTransactionByIdRepository
  }
  async execute(
    transactionId: string,
    userId: string,
  ): Promise<ITransactionResponse | null> {
    const existing = await this.getTransactionByIdRepository.execute({
      transactionId,
    })
    if (!existing || existing.user_id !== userId) {
      throw new TransactionNotFoundError(transactionId)
    }

    const transaction =
      await this.deleteTransactionRepository.execute(transactionId)

    if (!transaction) {
      return null
    }

    return transaction
  }
}
