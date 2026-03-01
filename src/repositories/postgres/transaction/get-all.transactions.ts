import { PostgresHelper } from '../../../db/postgres/helper'
import { ITransactionResponse } from '../../../types'

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
    const transactions = await PostgresHelper.query<ITransactionResponse[]>(
      'SELECT * FROM transactions WHERE user_id = $1',
      [params.user_id],
    )
    return (transactions as ITransactionResponse[]) ?? null
  }
}
