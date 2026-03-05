import { prisma } from '../../../../prisma/prisma'
import { ITransactionResponse } from '../../../types'
import { mapTransactionFromDatabase } from './mapper'

export interface GetTransactionByIdParams {
  transactionId: string
}

export interface IPostgresGetTransactionByIdRepository {
  execute(
    params: GetTransactionByIdParams,
  ): Promise<ITransactionResponse | null>
}

export class PostgresGetTransactionByIdRepository implements IPostgresGetTransactionByIdRepository {
  async execute(
    params: GetTransactionByIdParams,
  ): Promise<ITransactionResponse | null> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: {
          id: params.transactionId,
        },
      })
      if (!transaction) {
        return null
      }
      return mapTransactionFromDatabase(transaction)
    } catch (error) {
      return null
    }
  }
}
