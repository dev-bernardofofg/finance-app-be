import { IPostgresUpdateTransactionRepository } from '../../repositories/postgres'
import {
  ITransactionParams,
  ITransactionResponse,
} from '../../types/transaction.type'

export interface IUpdateTransactionUseCase {
  execute(
    transactionId: string,
    updateTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse | null>
}

export class UpdateTransactionUseCase implements IUpdateTransactionUseCase {
  private updateTransactionRepository: IPostgresUpdateTransactionRepository
  constructor(
    updateTransactionRepository: IPostgresUpdateTransactionRepository,
  ) {
    this.updateTransactionRepository = updateTransactionRepository
  }
  async execute(
    transactionId: string,
    updateTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse | null> {
    try {
      const transaction = await this.updateTransactionRepository.execute(
        transactionId,
        updateTransactionParams,
      )

      if (!transaction) {
        throw new Error('Transação não encontrada')
      }

      return transaction
    } catch (error) {
      throw new Error('Erro ao atualizar transação')
    }
  }
}
