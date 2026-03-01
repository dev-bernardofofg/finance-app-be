import { IPostgresUpdateTransactionRepository } from '../../repositories/postgres'
import { ITransactionParams, ITransactionResponse } from '../../types'

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
