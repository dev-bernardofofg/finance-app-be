import { faker } from '@faker-js/faker'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import { makeHttpResponse } from '../../helpers/test'
import { UpdateUserParams, UserFields } from '../../repositories/postgres'
import { userFixture } from '../../test/fixtures/user'
import { UserResponse } from '../../types'
import { UpdateUserController } from './update.user'

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
    id: string = userFixture.id,
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

  it('should return 400 when body is not an object', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = {
      body: null,
      params: { id: faker.string.uuid() },
    }
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest as never, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
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
    const httpRequest = makeHttpRequest({ id: 'id-invalido' })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(updateUserUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Campos inválidos: id',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when the user id is required', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest(undefined, '')
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O ID do usuário é obrigatório',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when the user id is undefined', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const httpRequest = {
      body: { first_name: faker.person.firstName() },
      params: {} as { id: string },
    }
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(updateUserUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O ID do usuário é obrigatório',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when the user id is not a valid uuid', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(undefined, 'not-a-uuid')
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(updateUserUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(result).toBe(response)
  })

  it('should return 400 when the body has no fields to update', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = {
      body: {},
      params: { id: userFixture.id },
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
    const httpRequest = makeHttpRequest({ email: userFixture.email })
    const { response } = makeHttpResponse()
    updateUserUseCaseStub.execute.mockRejectedValueOnce(
      new EmailAlreadyInUseError(userFixture.email),
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(409)
    expect(response.json).toHaveBeenCalledWith({
      message: `O email ${userFixture.email} já está em uso.`,
    })
    expect(result).toBe(response)
  })

  it('should call UpdateUserUseCase with the correct parameters', async () => {
    // arrange
    const { sut, updateUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    const executeSpy = jest.spyOn(updateUserUseCaseStub, 'execute')

    // act
    await sut.execute(httpRequest, response)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.id,
      httpRequest.body,
    )
  })
})
