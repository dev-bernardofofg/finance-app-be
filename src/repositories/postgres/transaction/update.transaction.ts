import { PostgresHelper } from '../../../db/postgres/helper'
import { ITransactionParams, ITransactionResponse } from '../../../types'

export interface IPostgresUpdateTransactionRepository {
  execute(
    transactionId: string,
    updateTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse | null>
}

export class PostgresUpdateTransactionRepository implements IPostgresUpdateTransactionRepository {
  async execute(
    transactionId: string,
    updateTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse | null> {
    const updatedFields: string[] = []
    const updateValues: string[] = []

    Object.keys(updateTransactionParams).forEach((key) => {
      updatedFields.push(
        `${key as keyof ITransactionParams} = $${updateValues.length + 1}` as never,
      )
      updateValues.push(
        updateTransactionParams[key as keyof ITransactionParams] as never,
      )
    })

    updateValues.push(transactionId)

    const query = `
    UPDATE transactions 
    SET ${updatedFields.join(', ')} 
    WHERE id = $${updateValues.length}
    RETURNING *
    `

    const updatedTransaction = await PostgresHelper.query<
      ITransactionResponse[]
    >(query, updateValues)

    return (updatedTransaction[0] as ITransactionResponse) ?? null
  }
}
