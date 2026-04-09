import { TransactionType } from '../../../../generated/prisma/enums'
import { toNumberFromDatabase } from '../../../helpers/money'
import { prisma } from '../../../prisma/prisma'

export interface GetBalanceUserParams {
  id: string
}

export interface GetBalanceUserResponse {
  total_income: number
  total_expenses: number
  total_investments: number
  balance: number
}

export interface IGetBalanceUserRepository {
  execute(params: GetBalanceUserParams): Promise<GetBalanceUserResponse>
}

export class PostgresGetBalanceUserRepository implements IGetBalanceUserRepository {
  async execute(params: GetBalanceUserParams): Promise<GetBalanceUserResponse> {
    const [income, expense, investment] = await Promise.all([
      prisma.transaction.aggregate({
        where: { user_id: params.id, type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { user_id: params.id, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { user_id: params.id, type: TransactionType.INVESTMENT },
        _sum: { amount: true },
      }),
    ])

    const totalIncome = toNumberFromDatabase(income._sum.amount)
    const totalExpenses = toNumberFromDatabase(expense._sum.amount)
    const totalInvestments = toNumberFromDatabase(investment._sum.amount)

    return {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      total_investments: totalInvestments,
      balance: totalIncome - totalExpenses - totalInvestments,
    }
  }
}
