import { TransactionType } from '../../../../generated/prisma/enums'
import { prisma } from '@/prisma/prisma'
import { ITransactionParams, ITransactionResponse } from '@/types'

export interface IPostgresCreateTransactionRepository {
  execute(
    createTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse>
}

export class PostgresCreateTransactionRepository implements IPostgresCreateTransactionRepository {
  async execute(
    createTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse> {
    const createdTransactionByPrisma = await prisma.transaction.create({
      data: {
        id: createTransactionParams.id,
        user_id: createTransactionParams.user_id,
        name: createTransactionParams.name,
        type: createTransactionParams.type as TransactionType,
        amount: createTransactionParams.amount,
        date: createTransactionParams.date,
      },
    })
    return {
      ...createdTransactionByPrisma,
      date: createdTransactionByPrisma.date.toISOString(),
    }
  }
}
