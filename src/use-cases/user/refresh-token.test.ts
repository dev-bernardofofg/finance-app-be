import { UnauthorizedError } from '@/errors/user'
import { RefreshTokenUseCase } from './refresh-token'

describe('RefreshTokenUseCase', () => {
  class TokenVerifyAdapterStub {
    execute = jest.fn((): { userId: string } => ({ userId: 'user-id' }))
  }

  class TokenGeneratorAdapterStub {
    execute = jest.fn(async () => {
      return {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      }
    })
  }

  const makeSut = () => {
    const tokenVerifyAdapterStub = new TokenVerifyAdapterStub()
    const tokenGeneratorAdapterStub = new TokenGeneratorAdapterStub()

    const sut = new RefreshTokenUseCase(
      tokenGeneratorAdapterStub,
      tokenVerifyAdapterStub,
    )

    return { sut, tokenVerifyAdapterStub, tokenGeneratorAdapterStub }
  }

  it('should return a new access and refresh token', async () => {
    // arrange
    const { sut } = makeSut()
    const refreshToken = 'refresh-token'

    // act
    const result = await sut.execute(refreshToken)

    // assert
    expect(result).toEqual({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    })
  })

  it('should throw an UnauthorizedError if the refresh token is invalid', () => {
    // arrange
    const { sut, tokenVerifyAdapterStub } = makeSut()
    const refreshToken = 'invalid-refresh-token'
    jest.spyOn(tokenVerifyAdapterStub, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    // act & assert
    expect(() => sut.execute(refreshToken)).toThrow(new UnauthorizedError())
  })
})
