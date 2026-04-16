import { prisma } from '../../../prisma/prisma'
import { ITransactionResponse } from '../../../types'

export interface GetTransactionByIdParams {
  transactionId: string
}

export interface IPostgresGetTransactionByIdRepository {
  execute(
    params: GetTransactionByIdParams,
  ): Promise<ITransactionResponse | null>
}

export class PostgresGetTransactionByIdRepository implements IPostgresGetTransactionByIdRepository {
  async execute(params: GetTransactionByIdParams) {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: params.transactionId,
      },
    })
    return transaction
  }
}
