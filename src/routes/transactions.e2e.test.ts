import { faker } from '@faker-js/faker'
import request from 'supertest'
import { app } from '@/app'
import { createUserAndGetToken, tokenForMissingUser } from '@/routes/helpers'
import { transactionFixtureWithoutId } from '@/test/fixtures/transaction'

const transactionBody = () => {
  const { user_id: _, ...rest } = transactionFixtureWithoutId
  return rest
}

describe('Transactions Routes E2E Tests', () => {
  it('POST /transactions should return 201 when transaction is created successfully', async () => {
    const { accessToken } = await createUserAndGetToken()
    const response = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(transactionBody())
    expect(response.status).toBe(201)
  })

  it('POST /transactions should return 400 when the sent data is invalid', async () => {
    const { accessToken } = await createUserAndGetToken()
    const response = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ...transactionBody(), amount: 0 })
    expect(response.status).toBe(400)
  })

  it('POST /transactions should return 404 when user is not found', async () => {
    const accessToken = await tokenForMissingUser()
    const response = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(transactionBody())
    expect(response.status).toBe(404)
  })

  it('GET /transactions/:id should return 200 when transaction is found', async () => {
    const { accessToken } = await createUserAndGetToken()
    const createResponse = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(transactionBody())
    const transactionId = createResponse.body.id
    const response = await request(app)
      .get(`/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(response.status).toBe(200)
  })

  it('GET /transactions/:id should return 404 when transaction is not found', async () => {
    const { accessToken } = await createUserAndGetToken()
    const response = await request(app)
      .get(`/transactions/${faker.string.uuid()}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(response.status).toBe(404)
  })

  it('PUT /transactions/:id should return 200 when transaction is updated successfully', async () => {
    const { accessToken } = await createUserAndGetToken()
    const createResponse = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(transactionBody())
    const transactionId = createResponse.body.id
    const response = await request(app)
      .put(`/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(transactionBody())
    expect(response.status).toBe(200)
  })

  it('PUT /transactions/:id should return 404 when transaction is not found', async () => {
    const { accessToken } = await createUserAndGetToken()
    const response = await request(app)
      .put(`/transactions/${faker.string.uuid()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(transactionBody())
    expect(response.status).toBe(404)
  })

  it('DELETE /transactions/:id should return 200 when transaction is deleted successfully', async () => {
    const { accessToken } = await createUserAndGetToken()
    const createResponse = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(transactionBody())
    const transactionId = createResponse.body.id
    const response = await request(app)
      .delete(`/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(response.status).toBe(200)
  })

  it('DELETE /transactions/:id should return 404 when transaction is not found', async () => {
    const { accessToken } = await createUserAndGetToken()
    const response = await request(app)
      .delete(`/transactions/${faker.string.uuid()}`)
      .set('Authorization', `Bearer ${accessToken}`)
    expect(response.status).toBe(404)
  })

  it('GET /transactions should return 200 when transactions are found', async () => {
    const { accessToken } = await createUserAndGetToken()
    await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(transactionBody())
    const response = await request(app)
      .get('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
  })

  it('GET /transactions should return 404 when user is not found', async () => {
    const accessToken = await tokenForMissingUser()
    const response = await request(app)
      .get('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
    expect(response.status).toBe(404)
  })
})
