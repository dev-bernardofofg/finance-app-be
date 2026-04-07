import { IPostgresGetTransactionByIdRepository } from '../../repositories/postgres'
import { ITransactionResponse } from '../../types'

export interface IGetTransactionByIdUseCase {
  execute(transactionId: string): Promise<ITransactionResponse | null>
}

export class GetTransactionByIdUseCase implements IGetTransactionByIdUseCase {
  private getTransactionByIdRepository: IPostgresGetTransactionByIdRepository
  constructor(
    getTransactionByIdRepository: IPostgresGetTransactionByIdRepository,
  ) {
    this.getTransactionByIdRepository = getTransactionByIdRepository
  }
  async execute(transactionId: string): Promise<ITransactionResponse | null> {
    const transaction = await this.getTransactionByIdRepository.execute({
      transactionId,
    })

    if (!transaction) {
      return null
    }

    return transaction
  }
}
