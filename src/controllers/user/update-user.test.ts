import { faker } from '@faker-js/faker'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import { makeHttpResponse } from '../../helpers/test'
import { UpdateUserParams, UserFields } from '../../repositories/postgres'
import { UserResponse } from '../../types'
import { UpdateUserController } from './update-user'

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
    id: string = faker.string.uuid(),
  ) => ({
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      ...body,
    },
    params: { id },
  })

  it('should return 200 when updating user', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(undefined)
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(updateUserUseCaseStub.execute).toHaveBeenCalledWith(
      httpRequest.params.id,
      expect.objectContaining({
        first_name: httpRequest.body.first_name,
        last_name: httpRequest.body.last_name,
        email: httpRequest.body.email,
      }),
    )
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: httpRequest.params.id,
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
    // 'id-invalido' não é um UUID — validatorHelpers.idIsValid retorna 400 naturalmente,
    // sem precisar de mock. Testar com o valor real é mais confiável.
    const { sut, updateUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(undefined, 'id-invalido')
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(updateUserUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O ID não é válido. Por favor, informe um ID válido.',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when the body has no fields to update', async () => {
    // arrange
    const { sut } = makeSut()
    const userId = faker.string.uuid()
    const httpRequest = {
      body: {},
      params: { id: userId },
    }
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
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
    const httpRequest = makeHttpRequest(undefined)
    const { response } = makeHttpResponse()
    updateUserUseCaseStub.execute.mockRejectedValueOnce(
      new UserNotFoundError(httpRequest.params.id as string),
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Usuário com ID ${httpRequest.params.id} não encontrado.`,
    })
    expect(result).toBe(response)
  })

  it('should return 404 when the use case returns no user', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(undefined)
    const { response } = makeHttpResponse()
    updateUserUseCaseStub.execute.mockImplementationOnce(
      async (): Promise<UserResponse> => null as never,
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
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
    updateUserUseCaseStub.execute.mockRejectedValueOnce(new Error('falha'))

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
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
    updateUserUseCaseStub.execute.mockRejectedValueOnce(
      new EmailAlreadyInUseError(email),
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(409)
    expect(response.json).toHaveBeenCalledWith({
      message: `O email ${email} já está em uso.`,
    })
    expect(result).toBe(response)
  })
})
