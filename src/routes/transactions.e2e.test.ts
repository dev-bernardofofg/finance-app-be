import { faker } from '@faker-js/faker/.'
import request from 'supertest'
import { app } from '../app'
import { transactionFixtureWithoutId } from '../test/fixtures/transaction'
import { userFixtureWithoutId } from '../test/fixtures/user'

describe('Transactions Routes E2E Tests', () => {
  it('POST /transactions should return 201 when transaction is created successfully', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({ ...userFixtureWithoutId })
    const userId = createUserResponse.body.id

    const response = await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
      })
    expect(response.status).toBe(201)
  })

  it('POST /transactions should return 400 when the sent data is invalid', async () => {
    const response = await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        amount: 0,
      })
    expect(response.status).toBe(400)
  })

  it('POST /transactions should return 400 when missing user_id', async () => {
    const response = await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        user_id: undefined,
      })
    expect(response.status).toBe(400)
  })

  it('POST /transactions should return 404 when user is not found', async () => {
    const response = await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        user_id: faker.string.uuid(),
      })
    expect(response.status).toBe(404)
  })

  it('GET /transactions/:id should return 200 when transaction is found', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({ ...userFixtureWithoutId })
    const userId = createUserResponse.body.id
    const createTransactionResponse = await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
      })
    const transactionId = createTransactionResponse.body.id

    const response = await request(app).get(`/transactions/${transactionId}`)
    expect(response.status).toBe(200)
  })

  it('GET /transactions/:id should return 404 when transaction is not found', async () => {
    const response = await request(app).get(
      `/transactions/${faker.string.uuid()}`,
    )
    expect(response.status).toBe(404)
  })

  it('PUT /transactions/:id should return 200 when transaction is updated successfully', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({ ...userFixtureWithoutId })
    const userId = createUserResponse.body.id
    const createTransactionResponse = await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
      })
    const transactionId = createTransactionResponse.body.id

    const { user_id: _userId, ...updateBody } = transactionFixtureWithoutId
    const response = await request(app)
      .put(`/transactions/${transactionId}`)
      .send(updateBody)
    expect(response.status).toBe(200)
  })

  it('PUT /transactions/:id should return 404 when transaction is not found', async () => {
    const { user_id: _userId, ...updateBody } = transactionFixtureWithoutId
    const response = await request(app)
      .put(`/transactions/${faker.string.uuid()}`)
      .send(updateBody)
    expect(response.status).toBe(404)
  })

  it('DELETE /transactions/:id should return 200 when transaction is deleted successfully', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({
        ...userFixtureWithoutId,
      })
    const userId = createUserResponse.body.id
    const createTransactionResponse = await request(app)
      .post('/transactions')
      .send({
        ...transactionFixtureWithoutId,
        user_id: userId,
      })
    const transactionId = createTransactionResponse.body.id
    const response = await request(app).delete(`/transactions/${transactionId}`)
    expect(response.status).toBe(200)
  })

  it('DELETE /transactions/:id should return 404 when transaction is not found', async () => {
    const response = await request(app).delete(
      `/transactions/${faker.string.uuid()}`,
    )
    expect(response.status).toBe(404)
  })

  it('GET /transactions should return 200 when transactions are found', async () => {
    const createUserResponse = await request(app)
      .post('/users')
      .send({ ...userFixtureWithoutId })
    const userId = createUserResponse.body.id

    const response = await request(app).get(`/transactions?userId=${userId}`)
    expect(response.status).toBe(200)
  })

  it('GET /transactions should return 404 when user is not found', async () => {
    const response = await request(app).get(
      `/transactions?userId=${faker.string.uuid()}`,
    )
    expect(response.status).toBe(404)
  })

  it('GET /transactions/user/:id should return 200 when transactions are found', async () => {
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
      })
    const response = await request(app).get(`/transactions/user/${userId}`)
    expect(response.status).toBe(200)
  })

  it('GET /transactions/user/:id should return 404 when user is not found', async () => {
    const response = await request(app).get(
      `/transactions/user/${faker.string.uuid()}`,
    )
    expect(response.status).toBe(404)
  })
})
