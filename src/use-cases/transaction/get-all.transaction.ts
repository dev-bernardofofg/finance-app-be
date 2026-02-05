import {
  GetTransactionsParams,
  IPostgresGetTransactionsRepository,
} from '../../repositories/postgres'
import { ITransactionResponse } from '../../types/transaction.type'

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
    try {
      const transactions = await this.getTransactionsRepository.execute(params)
      if (!transactions) {
        throw new Error('Transações não encontradas')
      }
      return transactions
    } catch (error) {
      throw new Error('Erro ao buscar transações')
    }
  }
}
