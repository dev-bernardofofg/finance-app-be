import { dateHelpers } from '@/helpers/date'
import { TransactionType } from '../../../../generated/prisma/enums'
import { prisma } from '@/prisma/prisma'
import { Prisma } from '../../../../generated/prisma/client'

export interface GetBalanceUserParams {
  id: string
  from_date?: string | Date
  to_date?: string | Date
}

export interface GetBalanceUserResponse {
  total_income: number
  total_expenses: number
  total_investments: number
  balance: number
  earning_percentage: number
  investment_percentage: number
  expenses_percentage: number
}

export interface IGetBalanceUserRepository {
  execute(params: GetBalanceUserParams): Promise<GetBalanceUserResponse>
}

export class PostgresGetBalanceUserRepository implements IGetBalanceUserRepository {
  async execute(params: GetBalanceUserParams): Promise<GetBalanceUserResponse> {
    const [income, expense, investment] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          user_id: params.id,
          type: TransactionType.INCOME,
          date: dateHelpers.getDateRange(params.from_date, params.to_date),
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          user_id: params.id,
          type: TransactionType.EXPENSE,
          date: dateHelpers.getDateRange(params.from_date, params.to_date),
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          user_id: params.id,
          type: TransactionType.INVESTMENT,
          date: dateHelpers.getDateRange(params.from_date, params.to_date),
        },
        _sum: { amount: true },
      }),
    ])

    const _totalIncome = new Prisma.Decimal(income._sum.amount ?? 0)
    const _totalExpenses = new Prisma.Decimal(expense._sum.amount ?? 0)
    const _totalInvestments = new Prisma.Decimal(investment._sum.amount ?? 0)

    const balance = _totalIncome.minus(_totalExpenses).minus(_totalInvestments)

    const total = _totalIncome.plus(_totalExpenses).plus(_totalInvestments)

    const getPercentage = (amount: Prisma.Decimal, base: Prisma.Decimal) => {
      if (base.isZero()) return 0
      return amount.div(base).mul(100).floor().toNumber()
    }

    const earningPercentage = getPercentage(_totalIncome, total)
    const investmentPercentage = getPercentage(_totalInvestments, total)
    const expensesPercentage = getPercentage(_totalExpenses, total)

    return {
      total_income: _totalIncome.toNumber(),
      total_expenses: _totalExpenses.toNumber(),
      total_investments: _totalInvestments.toNumber(),
      balance: balance.toNumber(),
      earning_percentage: earningPercentage,
      investment_percentage: investmentPercentage,
      expenses_percentage: expensesPercentage,
    }
  }
}
