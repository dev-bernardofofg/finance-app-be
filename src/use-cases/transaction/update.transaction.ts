import { TransactionNotFoundError } from '@/errors/transaction'
import {
  IPostgresGetTransactionByIdRepository,
  IPostgresUpdateTransactionRepository,
} from '@/repositories/postgres'
import { ITransactionParams, ITransactionResponse } from '@/types'

export interface IUpdateTransactionUseCase {
  execute(
    transactionId: string,
    userId: string,
    updateTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse | null>
}

export class UpdateTransactionUseCase implements IUpdateTransactionUseCase {
  private updateTransactionRepository: IPostgresUpdateTransactionRepository
  private getTransactionByIdRepository: IPostgresGetTransactionByIdRepository
  constructor(
    updateTransactionRepository: IPostgresUpdateTransactionRepository,
    getTransactionByIdRepository: IPostgresGetTransactionByIdRepository,
  ) {
    this.updateTransactionRepository = updateTransactionRepository
    this.getTransactionByIdRepository = getTransactionByIdRepository
  }
  async execute(
    transactionId: string,
    userId: string,
    updateTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse | null> {
    const existing = await this.getTransactionByIdRepository.execute({
      transactionId,
    })
    if (!existing || existing.user_id !== userId) {
      throw new TransactionNotFoundError(transactionId)
    }

    const transaction = await this.updateTransactionRepository.execute(
      transactionId,
      updateTransactionParams,
    )

    if (!transaction) {
      return null
    }

    return transaction
  }
}
