import {
  GetTransactionsParams,
  IPostgresGetTransactionsRepository,
} from '../../repositories/postgres'
import { ITransactionResponse } from '../../types'

export interface IGetAllTransactionsUseCase {
  execute(params: GetTransactionsParams): Promise<ITransactionResponse[] | null>
}

export class GetAllTransactionsUseCase implements IGetAllTransactionsUseCase {
  private getTransactionsRepository: IPostgresGetTransactionsRepository
  constructor(getTransactionsRepository: IPostgresGetTransactionsRepository) {
    this.getTransactionsRepository = getTransactionsRepository
  }
  async execute(
    params: GetTransactionsParams,
  ): Promise<ITransactionResponse[] | null> {
    const transactions = await this.getTransactionsRepository.execute(params)

    if (!transactions) {
      return null
    }

    return transactions
  }
}
