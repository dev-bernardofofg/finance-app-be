import { EmailUserNotFoundError } from '../../errors/user'
import { makeHttpResponse } from '../../helpers/test'
import { userFixture } from '../../test/fixtures/user'
import { UserResponse } from '../../types'
import { GetUserByEmailController } from './get-by-email.user'

describe('GetUserByEmailController', () => {
  class GetUserByEmailUseCaseStub {
    execute = jest.fn(async (): Promise<UserResponse> => userFixture)
  }

  const makeSut = () => {
    const getUserByEmailUseCaseStub = new GetUserByEmailUseCaseStub()
    const sut = new GetUserByEmailController(getUserByEmailUseCaseStub)
    return { sut, getUserByEmailUseCaseStub }
  }

  const makeHttpRequest = () => ({
    query: {
      email: userFixture.email,
    },
  })

  it('should return 200 when the user is found', async () => {
    // arrange
    const { sut, getUserByEmailUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(getUserByEmailUseCaseStub.execute).toHaveBeenCalledWith({
      email: httpRequest.query.email,
    })
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ email: httpRequest.query.email }),
    )
    expect(result).toBe(response)
  })

  it('should return 400 when the email format is invalid', async () => {
    // arrange
    const { sut, getUserByEmailUseCaseStub } = makeSut()
    const httpRequest = { query: { email: 'email-invalido' } }
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(getUserByEmailUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O email não é válido',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when the email is missing', async () => {
    // arrange
    const { sut, getUserByEmailUseCaseStub } = makeSut()
    const httpRequest = { query: {} }
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(getUserByEmailUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O email é obrigatório',
    })
    expect(result).toBe(response)
  })

  it('should return 404 when the user is not found', async () => {
    // arrange
    const { sut, getUserByEmailUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    getUserByEmailUseCaseStub.execute.mockRejectedValueOnce(
      new EmailUserNotFoundError(httpRequest.query.email),
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(getUserByEmailUseCaseStub.execute).toHaveBeenCalledWith({
      email: httpRequest.query.email,
    })

    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Usuário com email ${httpRequest.query.email} não encontrado.`,
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    // arrange
    const { sut, getUserByEmailUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    getUserByEmailUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(getUserByEmailUseCaseStub.execute).toHaveBeenCalledWith({
      email: httpRequest.query.email,
    })
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar usuário',
    })
    expect(result).toBe(response)
  })
})
