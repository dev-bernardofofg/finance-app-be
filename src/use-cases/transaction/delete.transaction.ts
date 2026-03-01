import { IPostgresDeleteTransactionRepository } from '../../repositories/postgres'
import { ITransactionResponse } from '../../types'

export interface IDeleteTransactionUseCase {
  execute(transactionId: string): Promise<ITransactionResponse | null>
}

export class DeleteTransactionUseCase implements IDeleteTransactionUseCase {
  private deleteTransactionRepository: IPostgresDeleteTransactionRepository
  constructor(
    deleteTransactionRepository: IPostgresDeleteTransactionRepository,
  ) {
    this.deleteTransactionRepository = deleteTransactionRepository
  }
  async execute(transactionId: string): Promise<ITransactionResponse | null> {
    const transaction =
      await this.deleteTransactionRepository.execute(transactionId)

    if (!transaction) {
      return null
    }

    return transaction
  }
}
