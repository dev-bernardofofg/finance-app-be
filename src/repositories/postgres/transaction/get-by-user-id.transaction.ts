import { PostgresHelper } from '../../../db/postgres/helper'
import { ITransactionResponse } from '../../../types'

export interface GetTransactionByUserIdParams {
  userId: string
}

export interface IPostgresGetTransactionByUserIdRepository {
  execute(userId: string): Promise<ITransactionResponse[]>
}

export class PostgresGetTransactionByUserIdRepository implements IPostgresGetTransactionByUserIdRepository {
  async execute(userId: string): Promise<ITransactionResponse[]> {
    const transactions = await PostgresHelper.query<ITransactionResponse[]>(
      'SELECT * FROM transactions WHERE user_id = $1',
      [userId],
    )
    return transactions
  }
}
