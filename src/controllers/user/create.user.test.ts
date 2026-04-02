import { faker } from '@faker-js/faker'
import { Request } from 'express'
import { EmailAlreadyInUseError } from '../../errors/user'
import { makeHttpResponse } from '../../helpers/test'
import { CreateUserParams, UserResponse } from '../../types'
import { CreateUserController } from './create.user'

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

  const makeSut = () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const sut = new CreateUserController(createUserUseCaseStub)
    return { sut, createUserUseCaseStub }
  }

  const makeHttpRequest = (body?: Partial<CreateUserParams>) =>
    ({
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
        ...body,
      },
    }) as Request

  it('should return 201 when user is created successfully', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(201)
    expect(result).toBe(response)
  })

  it('should return 400 when the sent data is invalid', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ email: 'email-invalido' })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O email não é válido',
    })
    expect(result).toBe(response)
  })

  it('should return 409 when the email is already in use', async () => {
    // arrange
    const { sut, createUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    createUserUseCaseStub.execute.mockRejectedValueOnce(
      new EmailAlreadyInUseError(httpRequest.body.email),
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(409)
    expect(response.json).toHaveBeenCalledWith({
      message: `O email ${httpRequest.body.email} já está em uso.`,
    })
    expect(result).toBe(response)
  })

  it('should return 400 if email is not valid', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ email: 'email-invalido' })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O email não é válido',
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    // arrange
    const { sut, createUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    createUserUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao criar usuário',
    })
    expect(result).toBe(response)
  })

  it('should return 400 if password is less than 6 characters', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ password: '12345' })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'A senha deve ter pelo menos 6 caracteres',
    })
    expect(result).toBe(response)
  })

  it('should call CreateUserUseCase with correct parameters', async () => {
    // arrange
    const { sut, createUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    // Explicação: spyOn é uma função que permite espionar uma função e retornar o valor dela
    // nesse caso, estamos espionando a função execute do createUserUseCaseStub e retornando o valor dela
    const executeSpy = jest.spyOn(createUserUseCaseStub, 'execute')
    // act
    await sut.execute(httpRequest, response)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 500 if CreateUserUseCase throws an error', async () => {
    // arrange
    const { sut, createUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    // Explicação: mockImplementationOnce é uma função que permite mockar uma função e alterar o valor de retorno da função
    jest.spyOn(createUserUseCaseStub, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })
    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao criar usuário',
    })
    expect(result).toBe(response)
  })

  it('should return 409 if CreateUserUseCase throws an EmailAlreadyInUseError', async () => {
    // arrange
    const { sut, createUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    jest
      .spyOn(createUserUseCaseStub, 'execute')
      .mockImplementationOnce(async () => {
        throw new EmailAlreadyInUseError(httpRequest.body.email)
      })

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(409)
    expect(response.json).toHaveBeenCalledWith({
      message: `O email ${httpRequest.body.email} já está em uso.`,
    })
    expect(result).toBe(response)
  })
})
