import { faker } from '@faker-js/faker/.'

const Transaction = {
  user_id: faker.string.uuid(),
  name: faker.person.firstName(),
  type: faker.helpers.arrayElement(['INCOME', 'EXPENSE', 'INVESTMENT']),
  amount: faker.number.int({ min: 1, max: 100000 }),
  date: faker.date.recent().toISOString(),
}

export const transactionFixture = {
  id: faker.string.uuid(),
  ...Transaction,
}

export const transactionFixtureWithoutId = Transaction
