import { faker } from '@faker-js/faker'
import { EmailAlreadyInUseError } from '../../errors/user'
import { UserResponse } from '../../types'
import { CreateUserUseCase } from './create.user'

describe('CreateUserUseCase', () => {
  class GetUserByEmailRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse | null> => {
      return null
    })
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
      return 'generated-id'
    })
  }

  const makeHttpRequest = () => {
    return {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const createUserRepository = new CreateUserRepositoryStub()
    const passwordHasherAdapter = new PasswordHasherAdapterStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()

    const sut = new CreateUserUseCase(
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
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
