import { prisma } from '@/prisma/prisma'
import { ITransactionResponse } from '@/types'
import { mapTransactionFromDatabase } from './mapper'

export interface GetTransactionByUserIdParams {
  user_id: string
  from_date?: string
  to_date?: string
}

export interface IPostgresGetTransactionByUserIdRepository {
  execute(params: GetTransactionByUserIdParams): Promise<ITransactionResponse[]>
}

export class PostgresGetTransactionByUserIdRepository implements IPostgresGetTransactionByUserIdRepository {
  async execute(
    params: GetTransactionByUserIdParams,
  ): Promise<ITransactionResponse[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: params.user_id,
        date: {
          gte: params.from_date,
          lte: params.to_date,
        },
      },
    })
    return transactions.map((transaction) =>
      mapTransactionFromDatabase({
        ...transaction,
        date: transaction.date.toISOString(),
      }),
    )
  }
}
