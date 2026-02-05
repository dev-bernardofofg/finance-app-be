import {
  GetTransactionByIdParams,
  IPostgresGetTransactionByIdRepository,
} from '../../repositories/postgres'
import { ITransactionResponse } from '../../types/transaction.type'

export interface IGetTransactionByIdUseCase {
  execute(
    params: GetTransactionByIdParams,
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
    params: GetTransactionByIdParams,
  ): Promise<ITransactionResponse | null> {
    try {
      const transaction =
        await this.getTransactionByIdRepository.execute(params)
      if (!transaction) {
        throw new Error('Transação não encontrada')
      }
      return transaction
    } catch (error) {
      throw new Error('Erro ao buscar transação')
    }
  }
}
