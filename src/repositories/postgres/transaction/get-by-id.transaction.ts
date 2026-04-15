import { TransactionNotFoundError } from '../../../errors/transaction'
import { prisma } from '../../../prisma/prisma'
import { ITransactionResponse } from '../../../types'
import { mapTransactionFromDatabase } from './mapper'

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
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: params.transactionId,
      },
    })
    if (!transaction) throw new TransactionNotFoundError(params.transactionId)
    return mapTransactionFromDatabase({
      ...transaction,
      date: transaction.date.toISOString(),
    })
  }
}
