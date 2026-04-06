import { faker } from '@faker-js/faker'
import { EmailAlreadyInUseError } from '../../errors/user'
import { UserResponse } from '../../types'
import { UpdateUserUseCase } from './update.user'

describe('UpdateUserUseCase', () => {
  class GetUserByEmailRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse | null> => null)
  }

  class PasswordHasherAdapterStub {
    execute = jest.fn(async () => {
      return 'hashed-password'
    })
  }

  class UpdateUserRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse> => makeUser())
  }

  const makeUser = () => ({
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 6 }),
  })

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const passwordHasherAdapter = new PasswordHasherAdapterStub()
    const updateUserRepository = new UpdateUserRepositoryStub()

    const sut = new UpdateUserUseCase(
      getUserByEmailRepository,
      updateUserRepository,
      passwordHasherAdapter,
    )
    return {
      sut,
      getUserByEmailRepository,
      passwordHasherAdapter,
      updateUserRepository,
    }
  }

  it('should update the user successfully (without email and password)', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()
    const user = makeUser()
    updateUserRepository.execute.mockResolvedValueOnce(user)
    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    }
    // act
    const result = await sut.execute(user.id, updateUserParams)

    // assert
    expect(result).toEqual(user)
  })

  it('should update the user successfully (with email and password)', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()
    const user = makeUser()
    updateUserRepository.execute.mockResolvedValueOnce(user)
    const updateUserParams = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    }
    // act
    const result = await sut.execute(user.id, updateUserParams)

    // assert
    expect(result).toEqual(user)
  })

  it('should update the user successfully (with email)', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()
    const user = makeUser()
    updateUserRepository.execute.mockResolvedValueOnce(user)
    const updateUserParams = {
      email: faker.internet.email(),
    }
    // act
    const result = await sut.execute(user.id, updateUserParams)

    // assert
    expect(result).toEqual(user)
  })

  it('should update the user successfully (with password)', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()
    const user = makeUser()
    updateUserRepository.execute.mockResolvedValueOnce(user)
    const updateUserParams = {
      password: faker.internet.password({ length: 6 }),
    }

    // act
    const result = await sut.execute(user.id, updateUserParams)

    // assert
    expect(result).toEqual(user)
  })

  it('should return null when user is not found', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()
    const user = makeUser()
    updateUserRepository.execute.mockResolvedValueOnce(null as never)
    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    }

    // act
    const result = await sut.execute(user.id, updateUserParams)

    // assert
    expect(result).toEqual(null)
  })

  it('should throw EmailAlreadyInUseError if the email is already in use', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    const user = makeUser()
    const otherUser = makeUser()
    getUserByEmailRepository.execute.mockResolvedValueOnce(otherUser)
    const updateUserParams = {
      email: otherUser.email,
    }

    // act
    const result = sut.execute(user.id, updateUserParams)

    // assert
    await expect(result).rejects.toThrow(EmailAlreadyInUseError)
  })

  it('should throw error if GetUserByEmailRepository throws error', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    const user = makeUser()
    getUserByEmailRepository.execute.mockRejectedValueOnce(new Error())
    const updateUserParams = {
      email: faker.internet.email(),
    }

    // act
    const result = sut.execute(user.id, updateUserParams)

    // assert
    await expect(result).rejects.toThrow(Error)
  })

  it('should throw error if UpdateUserRepository throws error', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()
    const user = makeUser()
    updateUserRepository.execute.mockRejectedValueOnce(new Error())
    const updateUserParams = {
      email: faker.internet.email(),
    }

    // act
    const result = sut.execute(user.id, updateUserParams)

    // assert
    await expect(result).rejects.toThrow(Error)
  })

  it('should call GetUserByEmailRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    const user = makeUser()
    getUserByEmailRepository.execute.mockResolvedValueOnce(user)
    const updateUserParams = {
      email: faker.internet.email(),
    }

    // act
    await sut.execute(user.id, updateUserParams)

    // assert
    expect(getUserByEmailRepository.execute).toHaveBeenCalledWith({
      email: updateUserParams.email,
    })
  })
})
