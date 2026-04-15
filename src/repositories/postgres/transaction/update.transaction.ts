import { prisma } from '../../../prisma/prisma'
import { ITransactionParams, ITransactionResponse } from '../../../types'
import { mapTransactionFromDatabase } from './mapper'

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
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: updateTransactionParams,
    })
    return mapTransactionFromDatabase({
      ...updatedTransaction,
      date: updatedTransaction.date.toISOString(),
    })
  }
}
