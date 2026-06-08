import { faker } from '@faker-js/faker'

export const balanceFixture = {
  total_income: Number(faker.finance.amount()),
  total_expenses: Number(faker.finance.amount()),
  total_investments: Number(faker.finance.amount()),
  balance: Number(faker.finance.amount()),
  earning_percentage: 100,
  investment_percentage: 100,
  expenses_percentage: 100,
} as const
