import { faker } from '@faker-js/faker/.'
import request from 'supertest'
import { app } from '../app'
import { userFixtureWithoutId } from '../test/fixtures/user'

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
})
