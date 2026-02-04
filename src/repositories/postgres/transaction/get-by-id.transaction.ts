import { PostgresHelper } from '../../../db/postgres/helper'
import { ITransactionResponse } from '../../../types/transaction.type'

export interface GetTransactionByIdParams {
  id: string
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
      [params.id],
    )
    return (transaction[0] as ITransactionResponse) ?? null
  }
}
