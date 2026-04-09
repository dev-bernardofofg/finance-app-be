import { prisma } from '../../../prisma/prisma'
import { ITransactionResponse } from '../../../types'
import { mapTransactionFromDatabase } from './mapper'

export interface GetTransactionByUserIdParams {
  userId: string
}

export interface IPostgresGetTransactionByUserIdRepository {
  execute(userId: string): Promise<ITransactionResponse[]>
}

export class PostgresGetTransactionByUserIdRepository implements IPostgresGetTransactionByUserIdRepository {
  async execute(userId: string): Promise<ITransactionResponse[]> {
    try {
      const transactions = await prisma.transaction.findMany({
        where: {
          user_id: userId,
        },
      })
      return transactions.map((transaction) =>
        mapTransactionFromDatabase(transaction),
      )
    } catch (error) {
      return []
    }
  }
}
