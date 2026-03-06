import { Request } from 'express'
import { CreateUserParams, UserResponse } from '../../types'
import { HttpResponse } from '../helpers/http'
import { CreateUserController } from './create-user'

describe('CreateUserController', () => {
  class CreateUserUseCaseStub {
    async execute(user: CreateUserParams): Promise<UserResponse> {
      return {
        id: 'user-id',
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      }
    }
  }

  it('should return 201 when user is created', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: '123456',
      },
    } as Request

    const status = jest.fn().mockReturnThis()
    const json = jest.fn().mockReturnThis()
    const httpResponse: HttpResponse = { status, json }

    // act
    const result = await createUserController.execute(httpRequest, httpResponse)

    // assert
    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith({
      id: 'user-id',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
    })
    expect(result).toBe(httpResponse)
  })
})
