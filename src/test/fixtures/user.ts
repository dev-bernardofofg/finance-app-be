import { faker } from '@faker-js/faker/.'

const User = {
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 6 }),
}

export const userFixture = {
  ...User,
  id: faker.string.uuid(),
} as const

export const userFixtureWithoutId = {
  ...User,
} as const
