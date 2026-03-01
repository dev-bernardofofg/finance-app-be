import { PostgresHelper } from '../../../db/postgres/helper'
import { ITransactionParams, ITransactionResponse } from '../../../types'

export interface IPostgresCreateTransactionRepository {
  execute(
    createTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse>
}

export class PostgresCreateTransactionRepository implements IPostgresCreateTransactionRepository {
  async execute(
    createTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse> {
    const createdTransaction = await PostgresHelper.query<
      ITransactionResponse[]
    >(
      `INSERT INTO transactions (id, user_id, name, type, amount, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        createTransactionParams.id,
        createTransactionParams.user_id,
        createTransactionParams.name,
        createTransactionParams.type,
        createTransactionParams.amount,
        createTransactionParams.date,
      ],
    )

    return createdTransaction[0] as ITransactionResponse
  }
}
