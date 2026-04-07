import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { makeHttpRequestById, makeHttpResponse } from '../../helpers/test'
import { UserResponse } from '../../types'
import { GetUserByIdController } from './get-by-id.user'

describe('GetUserByIdController', () => {
  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
  }
  class GetUserByIdUseCaseStub {
    execute = jest.fn(async (): Promise<UserResponse> => user)
  }

  const makeSut = () => {
    const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub()
    const sut = new GetUserByIdController(getUserByIdUseCaseStub)
    return { sut, getUserByIdUseCaseStub }
  }

  const makeHttpRequest = (id: string) => ({
    params: { id },
  })

  it('should return 200 when getting user by id', async () => {
    // arrange
    const { sut, getUserByIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(user.id)
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(getUserByIdUseCaseStub.execute).toHaveBeenCalledWith(user.id)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: user.id }),
    )
    expect(result).toBe(response)
  })

  it('should return 400 when the user id is missing', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequestById({ id: undefined })
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

  it('should return 400 when the user id is invalid', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequestById({ id: 'invalid-id' })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O ID não é válido. Por favor, informe um ID válido.',
    })
    expect(result).toBe(response)
  })

  it('should return 404 when user is not found', async () => {
    // arrange
    const { sut, getUserByIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: faker.string.uuid() })
    const { response } = makeHttpResponse()

    getUserByIdUseCaseStub.execute.mockRejectedValueOnce(
      new UserNotFoundError(httpRequest.params.id),
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(getUserByIdUseCaseStub.execute).toHaveBeenCalledWith(
      httpRequest.params.id,
    )
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Usuário com ID ${httpRequest.params.id} não encontrado.`,
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    // arrange
    const { sut, getUserByIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: faker.string.uuid() })
    const { response } = makeHttpResponse()

    getUserByIdUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar usuário',
    })
    expect(result).toBe(response)
  })

  it('should call GetUserByIdUseCase with the correct parameters', async () => {
    // arrange
    const { sut, getUserByIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(user.id)
    const { response } = makeHttpResponse()
    const executeSpy = jest.spyOn(getUserByIdUseCaseStub, 'execute')

    // act
    await sut.execute(httpRequest, response)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })
})
