import { faker } from '@faker-js/faker'
import request from 'supertest'
import { TokenGeneratorAdapter } from '@/adapters/token-generator'
import { app } from '@/app'

export const tokenForMissingUser = async () => {
  const { access_token } = await new TokenGeneratorAdapter().execute(
    faker.string.uuid(),
  )
  return access_token
}

export const createUserAndGetToken = async () => {
  const { body } = await request(app)
    .post('/users')
    .send({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    })
  return {
    userId: body.id as string,
    accessToken: body.tokens.access_token as string,
  }
}
