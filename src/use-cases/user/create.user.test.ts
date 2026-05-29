import { faker } from '@faker-js/faker'
import { EmailAlreadyInUseError } from '@/errors/user'
import { userFixture } from '@/test/fixtures/user'
import { UserResponse } from '@/types'
import { CreateUserUseCase } from './create.user'

describe('CreateUserUseCase', () => {
  class GetUserByEmailRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse | null> => null)
  }

  class CreateUserRepositoryStub {
    execute = jest.fn(async (user) => {
      return user
    })
  }

  class PasswordHasherAdapterStub {
    execute = jest.fn(async () => {
      return 'hashed-password'
    })
  }

  class IdGeneratorAdapterStub {
    execute = jest.fn(async () => {
      return 'generated-id' as `${string}-${string}-${string}-${string}-${string}`
    })
  }

  class TokenGeneratorAdapterStub {
    execute = jest.fn(async () => {
      return {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      }
    })
  }
  const makeHttpRequest = () => userFixture

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const createUserRepository = new CreateUserRepositoryStub()
    const passwordHasherAdapter = new PasswordHasherAdapterStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()
    const tokenGeneratorAdapter = new TokenGeneratorAdapterStub()
    const sut = new CreateUserUseCase(
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
      tokenGeneratorAdapter,
    )

    return { sut, getUserByEmailRepository }
  }
  it('should create a user successfully', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()

    // act
    const result = await sut.execute(httpRequest)

    // assert
    expect(result).toBeTruthy()
    expect(result.tokens.access_token).toBeDefined()
    expect(result.tokens.refresh_token).toBeDefined()
  })

  it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    const httpRequest = makeHttpRequest()
    jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce({
      ...makeHttpRequest(),
      id: faker.string.uuid(),
    })

    // act
    const result = sut.execute(httpRequest)

    // assert
    await expect(result).rejects.toThrow(
      new EmailAlreadyInUseError(httpRequest.email),
    )
  })
})
