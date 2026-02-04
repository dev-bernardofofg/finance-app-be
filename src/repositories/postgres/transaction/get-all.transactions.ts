import { PostgresHelper } from '../../../db/postgres/helper'
import { ITransactionResponse } from '../../../types/transaction.type'

export interface GetTransactionsParams {
  userId: string
}

export interface IPostgresGetTransactionsRepository {
  execute(params: GetTransactionsParams): Promise<ITransactionResponse[] | null>
}

export class PostgresGetTransactionsRepository implements IPostgresGetTransactionsRepository {
  async execute(
    params: GetTransactionsParams,
  ): Promise<ITransactionResponse[] | null> {
    const transactions = await PostgresHelper.query<ITransactionResponse[]>(
      'SELECT * FROM transactions WHERE user_id = $1',
      [params.userId],
    )
    return (transactions as ITransactionResponse[]) ?? null
  }
}
