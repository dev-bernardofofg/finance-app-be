import { LoginUserController } from './login.user'
import { userFixture } from '@/test/fixtures/user'
import { makeHttpResponse } from '@/helpers/test'
import { EmailUserNotFoundError, InvalidCredentialsError } from '@/errors/user'

describe('LoginUserController', () => {
  class LoginUserUseCaseStub {
    execute = jest.fn(async () => {
      return {
        ...userFixture,
        tokens: {
          access_token: 'any_access_token',
          refresh_token: 'any_refresh_token',
        },
      }
    })
  }

  const makeSut = () => {
    const loginUserUseCaseStub = new LoginUserUseCaseStub()
    const sut = new LoginUserController(loginUserUseCaseStub)
    return { sut, loginUserUseCaseStub }
  }

  it('should return 200 with user and tokens when login is successful', async () => {
    // arrange
    const { sut, loginUserUseCaseStub } = makeSut()
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(
      { body: { email: userFixture.email, password: userFixture.password } },
      response,
    )

    // assert
    expect(loginUserUseCaseStub.execute).toHaveBeenCalledWith(
      userFixture.email,
      userFixture.password,
    )
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ...userFixture,
        tokens: {
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        },
      }),
    )
    expect(result).toBe(response)
  })

  it('should return 404 when the email is not found', async () => {
    // arrange
    const { sut, loginUserUseCaseStub } = makeSut()
    const { response } = makeHttpResponse()
    loginUserUseCaseStub.execute.mockRejectedValueOnce(
      new EmailUserNotFoundError(userFixture.email),
    )

    // act
    const result = await sut.execute(
      { body: { email: userFixture.email, password: userFixture.password } },
      response,
    )

    // assert
    expect(loginUserUseCaseStub.execute).toHaveBeenCalledWith(
      userFixture.email,
      userFixture.password,
    )
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Usuário com email ${userFixture.email} não encontrado.`,
    })
    expect(result).toBe(response)
  })

  it('should return 401 when the password is incorrect', async () => {
    // arrange
    const { sut, loginUserUseCaseStub } = makeSut()
    const { response } = makeHttpResponse()
    loginUserUseCaseStub.execute.mockRejectedValueOnce(
      new InvalidCredentialsError(),
    )

    // act
    const result = await sut.execute(
      { body: { email: userFixture.email, password: 'invalid-password' } },
      response,
    )

    // assert
    expect(loginUserUseCaseStub.execute).toHaveBeenCalledWith(
      userFixture.email,
      'invalid-password',
    )
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Credenciais inválidas.',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when the email is not provided', async () => {
    // arrange
    const { sut, loginUserUseCaseStub } = makeSut()
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(
      { body: { password: userFixture.password } },
      response,
    )

    // assert
    expect(loginUserUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O email é obrigatório',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when the password is not provided', async () => {
    // arrange
    const { sut, loginUserUseCaseStub } = makeSut()
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(
      { body: { email: userFixture.email } },
      response,
    )

    // assert
    expect(loginUserUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'A senha é obrigatória',
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    // arrange
    const { sut, loginUserUseCaseStub } = makeSut()
    const { response } = makeHttpResponse()
    loginUserUseCaseStub.execute.mockRejectedValueOnce(new Error('unexpected'))

    // act
    const result = await sut.execute(
      { body: { email: userFixture.email, password: userFixture.password } },
      response,
    )

    // assert
    expect(loginUserUseCaseStub.execute).toHaveBeenCalledWith(
      userFixture.email,
      userFixture.password,
    )
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao fazer login',
    })
    expect(result).toBe(response)
  })
})
