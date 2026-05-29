import { LoginUserController } from './login.user'
import { userFixture } from '../../test/fixtures/user'
import { makeHttpResponse } from '../../helpers/test'

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
})
