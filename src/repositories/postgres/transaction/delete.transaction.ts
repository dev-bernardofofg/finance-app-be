import { PostgresHelper } from '../../../db/postgres/helper'
import { ITransactionResponse } from '../../../types'

export interface IPostgresDeleteTransactionRepository {
  execute(transactionId: string): Promise<ITransactionResponse | null>
}

export class PostgresDeleteTransactionRepository implements IPostgresDeleteTransactionRepository {
  async execute(transactionId: string): Promise<ITransactionResponse | null> {
    const deletedTransaction = await PostgresHelper.query<
      ITransactionResponse[]
    >('DELETE FROM transactions WHERE id = $1 RETURNING *', [transactionId])
    return (deletedTransaction[0] as ITransactionResponse) ?? null
  }
}
