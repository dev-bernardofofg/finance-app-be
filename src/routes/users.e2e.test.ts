import { faker } from '@faker-js/faker'
import request from 'supertest'
import { TransactionType } from '../../generated/prisma/client'
import { app } from '@/app'
import { transactionFixtureWithoutId } from '@/test/fixtures/transaction'
import { userFixtureWithoutId } from '@/test/fixtures/user'

describe('User Routes E2E Tests', () => {
  it('POST /users should return 201 when user is created successfully', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    expect(response.status).toBe(201)
  })

  it('POST /users should return 400 when the sent data is invalid', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
        email: 'invalid-email',
      })
    expect(response.status).toBe(400)
  })

  it('POST /users should return 409 when the email is already in use', async () => {
    await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const response = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    expect(response.status).toBe(409)
  })

  it('GET /users/:id should return 200 when the user is found', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const userId = createUserResponse.body.id
    const response = await request(app).get(`/users/${userId}`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(createUserResponse.body)
  })

  it('GET /users/:id should return 404 when the user is not found', async () => {
    const response = await request(app).get(`/users/${faker.string.uuid()}`)
    expect(response.status).toBe(404)
  })

  it('PATCH /users/:id should return 200 when the user is updated successfully', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const userId = createUserResponse.body.id
    const response = await request(app)
      .patch(`/users/${userId}`)
      .send({
        ...userFixtureWithoutId,
      })
    expect(response.status).toBe(200)
  })

  it('PATCH /users/:id should return 400 when the sent data is invalid', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const userId = createUserResponse.body.id
    const response = await request(app).patch(`/users/${userId}`).send({
      email: 'invalid-email',
    })
    expect(response.status).toBe(400)
  })

  it('PATCH /users/:id should return 404 when the user is not found', async () => {
    const response = await request(app)
      .patch(`/users/${faker.string.uuid()}`)
      .send({
        ...userFixtureWithoutId,
      })
    expect(response.status).toBe(404)
  })

  it('DELETE /users/:id should return 200 when the user is deleted successfully', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const userId = createUserResponse.body.id
    const response = await request(app).delete(`/users/${userId}`)
    expect(response.status).toBe(200)
  })

  it('DELETE /users/:id should return 404 when the user is not found', async () => {
    const response = await request(app).delete(`/users/${faker.string.uuid()}`)
    expect(response.status).toBe(404)
  })

  it('DELETE /users/:id should return 200 when the user have transactions', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const userId = createUserResponse.body.id
    await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
        type: TransactionType.INCOME,
      })
    const response = await request(app).delete(`/users/${userId}`)
    expect(response.status).toBe(200)
  })

  it('GET /users/balance/:id should return 200 when the user have transactions', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const userId = createUserResponse.body.id

    await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
        type: TransactionType.INCOME,
        amount: 100,
      })
    await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
        type: TransactionType.EXPENSE,
        amount: 100,
      })
    await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
        type: TransactionType.INVESTMENT,
        amount: 100,
      })

    const response = await request(app).get(`/users/${userId}/balance`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      total_income: 100,
      total_expenses: 100,
      total_investments: 100,
      balance: -100,
    })
  })

  it('GET /users/balance/:id should return 404 when the user is not found', async () => {
    const response = await request(app).get(
      `/users/${faker.string.uuid()}/balance`,
    )
    expect(response.status).toBe(404)
  })

  it('POST /users/login should return 200 when the user is logged in successfully', async () => {
    await request(app)
      .post('/users')
      .send({ ...userFixtureWithoutId })
    const response = await request(app).post('/users/login').send({
      email: userFixtureWithoutId.email,
      password: userFixtureWithoutId.password,
    })
    expect(response.status).toBe(200)
    const { password: _, ...userWithoutPassword } = userFixtureWithoutId
    expect(response.body).toEqual(
      expect.objectContaining({
        ...userWithoutPassword,
        tokens: expect.objectContaining({
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        }),
      }),
    )
    expect(response.body).not.toHaveProperty('password')
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
