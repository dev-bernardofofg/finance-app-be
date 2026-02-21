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
    const transaction = await this.getTransactionByIdRepository.execute(params)

    if (!transaction) {
      return null
    }

    return transaction
  }
}
