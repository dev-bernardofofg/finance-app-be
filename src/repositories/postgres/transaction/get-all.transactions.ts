import { prisma } from '../../../../prisma/prisma'
import { ITransactionResponse } from '../../../types'
import { mapTransactionFromDatabase } from './mapper'

export interface GetTransactionsParams {
  user_id: string
}

export interface IPostgresGetTransactionsRepository {
  execute(params: GetTransactionsParams): Promise<ITransactionResponse[] | null>
}

export class PostgresGetTransactionsRepository implements IPostgresGetTransactionsRepository {
  async execute(
    params: GetTransactionsParams,
  ): Promise<ITransactionResponse[] | null> {
    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: params.user_id,
      },
    })
    return transactions.map((transaction) =>
      mapTransactionFromDatabase(transaction),
    )
  }
}
