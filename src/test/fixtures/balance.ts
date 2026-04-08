import { faker } from '@faker-js/faker/.'

export const balanceFixture = {
  total_income: Number(faker.finance.amount()),
  total_expenses: Number(faker.finance.amount()),
  total_investments: Number(faker.finance.amount()),
  balance: Number(faker.finance.amount()),
} as const
