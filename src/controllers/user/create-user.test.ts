import { Request } from 'express'
import { EmailAlreadyInUseError } from '../../errors/user'
import { CreateUserParams, UserResponse } from '../../types'
import { HttpResponse } from '../helpers/http'
import { CreateUserController } from './create-user'

describe('CreateUserController', () => {
  class CreateUserUseCaseStub {
    execute = jest.fn(
      async (user: CreateUserParams): Promise<UserResponse> => ({
        id: 'user-id',
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      }),
    )
  }

  const makeHttpRequest = (body?: Partial<CreateUserParams>) =>
    ({
      body: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: '123456',
        ...body,
      },
    }) as Request

  const makeHttpResponse = () => {
    const status = jest.fn().mockReturnThis()
    const json = jest.fn().mockReturnThis()
    const response: HttpResponse = { status, json }

    return { response, status, json }
  }

  it('should return 201 when user is created successfully', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)
    const httpRequest = makeHttpRequest()
    const { response, status, json } = makeHttpResponse()

    // act
    const result = await createUserController.execute(httpRequest, response)

    // assert
    expect(createUserUseCaseStub.execute).toHaveBeenCalledWith(httpRequest.body)
    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith({
      id: 'user-id',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when the sent data is invalid', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)
    const httpRequest = makeHttpRequest({ email: 'email-invalido' })
    const { response, status, json } = makeHttpResponse()

    // act
    const result = await createUserController.execute(httpRequest, response)

    // assert
    expect(createUserUseCaseStub.execute).not.toHaveBeenCalled()
    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({ message: 'O email não é válido' })
    expect(result).toBe(response)
  })

  it('should return 409 when the email is already in use', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)
    const httpRequest = makeHttpRequest()
    const { response, status, json } = makeHttpResponse()

    createUserUseCaseStub.execute.mockRejectedValueOnce(
      new EmailAlreadyInUseError(httpRequest.body.email),
    )

    // act
    const result = await createUserController.execute(httpRequest, response)

    // assert
    expect(status).toHaveBeenCalledWith(409)
    expect(json).toHaveBeenCalledWith({
      message: `O email ${httpRequest.body.email} já está em uso.`,
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    // arrange
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)
    const httpRequest = makeHttpRequest()
    const { response, status, json } = makeHttpResponse()

    createUserUseCaseStub.execute.mockRejectedValueOnce(
      new Error('falha inesperada'),
    )

    // act
    const result = await createUserController.execute(httpRequest, response)

    // assert
    expect(status).toHaveBeenCalledWith(500)
    expect(json).toHaveBeenCalledWith({ message: 'Erro ao criar usuário' })
    expect(result).toBe(response)
  })
})
