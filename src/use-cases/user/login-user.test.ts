import { EmailUserNotFoundError, InvalidPasswordError } from '../../errors/user'
import { userFixture } from '../../test/fixtures/user'
import { UserResponse } from '../../types'
import { LoginUserUseCase } from './login-user'

describe('LoginUserUseCase', () => {
  class GetUserByEmailRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse> => userFixture)
  }

  class PasswordComparerAdapterStub {
    execute = jest.fn(async (): Promise<boolean> => true)
  }

  class TokenGeneratorAdapterStub {
    execute = jest.fn(
      async (): Promise<{ access_token: string; refresh_token: string }> => ({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      }),
    )
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const passwordComparerAdapter = new PasswordComparerAdapterStub()
    const tokenGeneratorAdapter = new TokenGeneratorAdapterStub()
    const sut = new LoginUserUseCase(
      getUserByEmailRepository,
      passwordComparerAdapter,
      tokenGeneratorAdapter,
    )
    return { sut, getUserByEmailRepository, passwordComparerAdapter }
  }

  it('should throw EmailUserNotFoundError if user not found', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    getUserByEmailRepository.execute.mockResolvedValueOnce(null as never)
    // act
    const promise = sut.execute(userFixture.email, userFixture.password)
    // assert
    await expect(promise).rejects.toThrow(EmailUserNotFoundError)
  })

  it('should call GetUserByEmailRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByEmailRepository, 'execute')
    // act
    await sut.execute(userFixture.email, userFixture.password)
    // assert
    expect(executeSpy).toHaveBeenCalledWith(userFixture.email)
  })

  it('should throw InvalidPasswordError if password is invalid', async () => {
    // arrange
    const { sut, passwordComparerAdapter } = makeSut()
    passwordComparerAdapter.execute.mockResolvedValueOnce(false)
    // act
    const promise = sut.execute(userFixture.email, userFixture.password)
    // assert
    await expect(promise).rejects.toThrow(InvalidPasswordError)
  })

  it('should return the user and tokens successfully', async () => {
    // arrange
    const { sut } = makeSut()
    // act
    const result = await sut.execute(userFixture.email, userFixture.password)
    // assert
    expect(result.tokens.access_token).toBeTruthy()
    expect(result.tokens.refresh_token).toBeTruthy()
    expect(result.id).toBe(userFixture.id)
    expect(result.first_name).toBe(userFixture.first_name)
    expect(result.last_name).toBe(userFixture.last_name)
    expect(result.email).toBe(userFixture.email)
    expect(result.password).toBe(userFixture.password)
  })
})
