import { IPostgresDeleteTransactionRepository } from '../../repositories/postgres'
import { ITransactionResponse } from '../../types/transaction.type'

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
    try {
      const transaction =
        await this.deleteTransactionRepository.execute(transactionId)

      if (!transaction) {
        throw new Error('Transação não encontrada')
      }

      return transaction
    } catch (error) {
      throw new Error('Erro ao deletar transação')
    }
  }
}
