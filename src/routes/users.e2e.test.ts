import { faker } from '@faker-js/faker'
import request from 'supertest'
import { TransactionType } from '../../generated/prisma/client'
import { app } from '@/app'
import { transactionFixtureWithoutId } from '@/test/fixtures/transaction'
import { userFixtureWithoutId } from '@/test/fixtures/user'
import { tokenForMissingUser } from '@/routes/helpers'

describe('User Routes E2E Tests', () => {
  it('POST /users should return 201 when user is created successfully', async () => {
    const { status } = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    expect(status).toBe(201)
  })

  it('POST /users should return 400 when the sent data is invalid', async () => {
    const { status } = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
        email: 'invalid-email',
      })
    expect(status).toBe(400)
  })

  it('POST /users should return 409 when the email is already in use', async () => {
    await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const { status } = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    expect(status).toBe(409)
  })

  it('GET /users should return 200 when the user is found', async () => {
    const { body } = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const userId = body.id
    const { body: responseBody, status: responseStatus } = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${body.tokens.access_token}`)
    expect(responseStatus).toBe(200)
    expect(responseBody).toEqual(
      expect.objectContaining({
        id: userId,
        first_name: userFixtureWithoutId.first_name,
        last_name: userFixtureWithoutId.last_name,
        email: userFixtureWithoutId.email,
      }),
    )
  })

  it('GET /users should return 404 when the user is not found', async () => {
    const accessToken = await tokenForMissingUser()
    const { status } = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(status).toBe(404)
  })

  it('PATCH /users should return 200 when the user is updated successfully', async () => {
    const { body } = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const { status: responseStatus } = await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${body.tokens.access_token}`)
      .send({
        ...userFixtureWithoutId,
      })
    expect(responseStatus).toBe(200)
  })

  it('PATCH /users should return 400 when the sent data is invalid', async () => {
    const { body } = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const { status: responseStatus } = await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${body.tokens.access_token}`)
      .send({
        email: 'invalid-email',
      })
    expect(responseStatus).toBe(400)
  })

  it('PATCH /users should return 404 when the user is not found', async () => {
    const accessToken = await tokenForMissingUser()
    const { status: responseStatus } = await request(app)
      .patch('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ first_name: faker.person.firstName() })
    expect(responseStatus).toBe(404)
  })

  it('DELETE /users/:id should return 200 when the user is deleted successfully', async () => {
    const { body } = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const { status: responseStatus } = await request(app)
      .delete(`/users`)
      .set('Authorization', `Bearer ${body.tokens.access_token}`)
    expect(responseStatus).toBe(200)
  })

  it('DELETE /users should return 404 when the user is not found', async () => {
    const accessToken = await tokenForMissingUser()
    const { status: responseStatus } = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(responseStatus).toBe(404)
  })

  it('DELETE /users/:id should return 200 when the user have transactions', async () => {
    const { body } = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const userId = body.id
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${body.tokens.access_token}`)
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
        type: TransactionType.INCOME,
      })
    const { status: responseStatus } = await request(app)
      .delete(`/users`)
      .set('Authorization', `Bearer ${body.tokens.access_token}`)
    expect(responseStatus).toBe(200)
  })

  it('GET /users/balance/:id should return 200 when the user have transactions', async () => {
    const { body } = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const userId = body.id

    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${body.tokens.access_token}`)
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
        type: TransactionType.INCOME,
        amount: 100,
      })
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${body.tokens.access_token}`)
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
        type: TransactionType.EXPENSE,
        amount: 100,
      })
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${body.tokens.access_token}`)
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
        type: TransactionType.INVESTMENT,
        amount: 100,
      })

    const { body: responseBody, status: responseStatus } = await request(app)
      .get(`/users/balance`)
      .set('Authorization', `Bearer ${body.tokens.access_token}`)
    expect(responseStatus).toBe(200)
    expect(responseBody).toEqual({
      total_income: 100,
      total_expenses: 100,
      total_investments: 100,
      balance: -100,
    })
  })

  it('GET /users/balance should return 404 when the user is not found', async () => {
    const accessToken = await tokenForMissingUser()
    const { status: responseStatus } = await request(app)
      .get('/users/balance')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(responseStatus).toBe(404)
  })

  it('POST /users/login should return 200 when the user is logged in successfully', async () => {
    await request(app)
      .post('/users')
      .send({ ...userFixtureWithoutId })
    const { body: responseBody, status: responseStatus } = await request(app)
      .post('/users/login')
      .send({
        email: userFixtureWithoutId.email,
        password: userFixtureWithoutId.password,
      })
    expect(responseStatus).toBe(200)
    const { password: _, ...userWithoutPassword } = userFixtureWithoutId
    expect(responseBody).toEqual(
      expect.objectContaining({
        ...userWithoutPassword,
        tokens: expect.objectContaining({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        }),
      }),
    )
    expect(responseBody).not.toHaveProperty('password')
  })

  it('POST /users/login should return 401 when the password is incorrect', async () => {
    await request(app)
      .post('/users')
      .send({ ...userFixtureWithoutId })
    const response = await request(app).post('/users/login').send({
      email: userFixtureWithoutId.email,
      password: 'incorrect_password',
    })
    expect(response.status).toBe(401)
  })

  it('POST /users/login should return 401 when the email is not found', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'incorrect_email@example.com',
      password: userFixtureWithoutId.password,
    })
    expect(response.status).toBe(401)
  })

  it('POST /users/login should return 400 when the email is not provided', async () => {
    const response = await request(app).post('/users/login').send({
      password: userFixtureWithoutId.password,
    })
    expect(response.status).toBe(400)
  })

  it('POST /users/login should return 400 when the password is not provided', async () => {
    const response = await request(app).post('/users/login').send({
      email: userFixtureWithoutId.email,
    })
    expect(response.status).toBe(400)
  })
})

it('POST /users/refresh-token should return 200 when the refresh token is valid', async () => {
  const { body } = await request(app)
    .post('/users')
    .send({ ...userFixtureWithoutId, refresh_token: faker.string.uuid() })

  const { body: responseBody, status: responseStatus } = await request(app)
    .post('/users/refresh-token')
    .send({ refreshToken: body.tokens.refresh_token })

  expect(responseStatus).toBe(200)
  expect(responseBody).toEqual(
    expect.objectContaining({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
    }),
  )
})
