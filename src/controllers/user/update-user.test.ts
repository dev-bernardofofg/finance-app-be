import { faker } from '@faker-js/faker'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import { makeHttpResponse } from '../../helpers/test'
import { UpdateUserParams, UserFields } from '../../repositories/postgres'
import { UserResponse } from '../../types'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'
import { UpdateUserController, type UpdateUserHttpInput } from './update-user'

describe('UpdateUserController', () => {
  class UpdateUserUseCaseStub {
    execute = jest.fn(
      async (
        userId: string,
        updateUserParams: UserFields,
      ): Promise<UserResponse> => ({
        id: userId,
        first_name: updateUserParams.first_name ?? '',
        last_name: updateUserParams.last_name ?? '',
        email: updateUserParams.email ?? '',
      }),
    )
  }

  const makeSut = () => {
    const updateUserUseCaseStub = new UpdateUserUseCaseStub()
    const sut = new UpdateUserController(updateUserUseCaseStub)
    return { sut, updateUserUseCaseStub }
  }

  const makeHttpRequest = (
    body?: Partial<UpdateUserParams & { unallowed_field?: string }>,
    userId: string = faker.string.uuid(),
  ): UpdateUserHttpInput => ({
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      ...body,
    },
    params: { id: userId },
  })

  it('should return 200 when updating user', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const userId = faker.string.uuid()
    const httpRequest = makeHttpRequest(undefined, userId)
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(updateUserUseCaseStub.execute).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        first_name: httpRequest.body.first_name,
        last_name: httpRequest.body.last_name,
        email: httpRequest.body.email,
      }),
    )
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: userId,
        first_name: httpRequest.body.first_name,
        last_name: httpRequest.body.last_name,
        email: httpRequest.body.email,
      }),
    )
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

  it('should return 400 when the user id is invalid', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(undefined, 'id-invalido')
    const { response } = makeHttpResponse()

    // act
    jest
      .spyOn(validatorHelpers, 'idIsValid')
      .mockReturnValueOnce(
        responseHelper.badRequest(
          response,
          'O ID não é válido. Por favor, informe um ID válido.',
        ),
      )

    // assert
    const result = await sut.execute(httpRequest, response)

    expect(updateUserUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O ID não é válido. Por favor, informe um ID válido.',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when the body has no fields to update', async () => {
    const { sut } = makeSut()
    const userId = faker.string.uuid()
    const httpRequest: UpdateUserHttpInput = {
      body: {},
      params: { id: userId },
    }
    const { response } = makeHttpResponse()

    const result = await sut.execute(httpRequest, response)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Informe ao menos um campo para atualizar.',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when an unallowed field is sent', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ unallowed_field: '123' })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Campos inválidos: unallowed_field',
    })
    expect(result).toBe(response)
  })
  it('should return 404 when the user is not found (UserNotFoundError)', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const userId = faker.string.uuid()
    const httpRequest = makeHttpRequest(undefined, userId)
    const { response } = makeHttpResponse()

    // act
    updateUserUseCaseStub.execute.mockRejectedValueOnce(
      new UserNotFoundError(userId),
    )

    // assert
    const result = await sut.execute(httpRequest, response)

    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Usuário com ID ${userId} não encontrado.`,
    })
    expect(result).toBe(response)
  })

  it('should return 404 when the use case returns no user', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const userId = faker.string.uuid()
    const httpRequest = makeHttpRequest(undefined, userId)
    const { response } = makeHttpResponse()

    // act
    updateUserUseCaseStub.execute.mockImplementationOnce(
      async (): Promise<UserResponse> => null as never,
    )

    // assert
    const result = await sut.execute(httpRequest, response)

    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Usuário não encontrado',
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an internal server error occurs', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    // act
    updateUserUseCaseStub.execute.mockRejectedValueOnce(new Error('falha'))

    // assert
    const result = await sut.execute(httpRequest, response)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao atualizar usuário',
    })
    expect(result).toBe(response)
  })

  it('should return 409 when the email is already in use', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const email = faker.internet.email()
    const httpRequest = makeHttpRequest({ email })
    const { response } = makeHttpResponse()

    // act
    updateUserUseCaseStub.execute.mockRejectedValueOnce(
      new EmailAlreadyInUseError(email),
    )

    // assert
    const result = await sut.execute(httpRequest, response)

    expect(response.status).toHaveBeenCalledWith(409)
    expect(response.json).toHaveBeenCalledWith({
      message: `O email ${email} já está em uso.`,
    })
    expect(result).toBe(response)
  })
})
