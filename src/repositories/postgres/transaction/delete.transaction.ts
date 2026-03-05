import { prisma } from '../../../../prisma/prisma'
import { ITransactionResponse } from '../../../types'
import { mapTransactionFromDatabase } from './mapper'

export interface IPostgresDeleteTransactionRepository {
  execute(transactionId: string): Promise<ITransactionResponse | null>
}

export class PostgresDeleteTransactionRepository implements IPostgresDeleteTransactionRepository {
  async execute(transactionId: string): Promise<ITransactionResponse | null> {
    try {
      const deletedTransaction = await prisma.transaction.delete({
        where: {
          id: transactionId,
        },
      })
      return mapTransactionFromDatabase(deletedTransaction)
    } catch (error) {
      return null
    }
  }
}
