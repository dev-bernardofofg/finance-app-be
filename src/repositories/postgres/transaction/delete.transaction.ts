import { Prisma } from '../../../../generated/prisma/client'
import { TransactionNotFoundError } from '../../../errors/transaction'
import { prisma } from '../../../prisma/prisma'
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
      return mapTransactionFromDatabase({
        ...deletedTransaction,
        date: deletedTransaction.date.toISOString(),
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new TransactionNotFoundError(transactionId)
      }
      throw error
    }
  }
}
