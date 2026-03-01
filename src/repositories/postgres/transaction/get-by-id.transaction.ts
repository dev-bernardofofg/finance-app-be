import { PostgresHelper } from '../../../db/postgres/helper'
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
  async execute(
    params: GetTransactionByIdParams,
  ): Promise<ITransactionResponse | null> {
    const transaction = await PostgresHelper.query<ITransactionResponse[]>(
      'SELECT * FROM transactions WHERE id = $1',
      [params.transactionId],
    )
    return (transaction[0] as ITransactionResponse) ?? null
  }
}
