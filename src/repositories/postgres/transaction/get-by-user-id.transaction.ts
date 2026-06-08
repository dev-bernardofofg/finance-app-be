import { prisma } from '@/prisma/prisma'
import { ITransactionResponse } from '@/types'
import { dateHelpers } from '@/helpers/date'

export interface GetTransactionByUserIdParams {
  user_id: string
  from_date?: string | Date
  to_date?: string | Date
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
        date: dateHelpers.getDateRange(params.from_date, params.to_date),
      },
    })
    return transactions.map((transaction) => ({
      ...transaction,
      date: transaction.date.toISOString(),
    }))
  }
}
