import { faker } from '@faker-js/faker'
import { EmailAlreadyInUseError } from '../../errors/user'
import { userFixture } from '../../test/fixtures/user'
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
    execute = jest.fn(async (): Promise<UserResponse> => userFixture)
  }

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
    updateUserRepository.execute.mockResolvedValueOnce(userFixture)
    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    }
    // act
    const result = await sut.execute(userFixture.id, updateUserParams)

    // assert
    expect(result).toEqual(userFixture)
  })

  it('should update the user successfully (with email and password)', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()
    updateUserRepository.execute.mockResolvedValueOnce(userFixture)
    const updateUserParams = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    }
    // act
    const result = await sut.execute(userFixture.id, updateUserParams)

    // assert
    expect(result).toEqual(userFixture)
  })

  it('should update the user successfully (with email)', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()

    updateUserRepository.execute.mockResolvedValueOnce(userFixture)
    const updateUserParams = {
      email: faker.internet.email(),
    }
    // act
    const result = await sut.execute(userFixture.id, updateUserParams)

    // assert
    expect(result).toEqual(userFixture)
  })

  it('should update the user successfully (with password)', async () => {
    // arrange
    const { sut, updateUserRepository, passwordHasherAdapter } = makeSut()
    updateUserRepository.execute.mockResolvedValueOnce(userFixture)
    const originalPassword = faker.internet.password({ length: 6 })
    const updateUserParams = {
      password: originalPassword,
    }

    // act
    const result = await sut.execute(userFixture.id, updateUserParams)

    // assert
    expect(result).toEqual(userFixture)
    expect(passwordHasherAdapter.execute).toHaveBeenCalledWith(originalPassword)
  })

  it('should return null when user is not found', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()
    updateUserRepository.execute.mockResolvedValueOnce(null as never)
    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    }

    // act
    const result = await sut.execute(userFixture.id, updateUserParams)

    // assert
    expect(result).toEqual(null)
  })

  it('should throw EmailAlreadyInUseError if the email is already in use', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    const anotherUser = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      created_at: new Date(),
      updated_at: new Date(),
    } as UserResponse
    const executeSpy = jest.spyOn(getUserByEmailRepository, 'execute')
    executeSpy.mockResolvedValueOnce(anotherUser)

    // act
    const result = sut.execute(userFixture.id, { email: anotherUser.email })

    // assert
    await expect(result).rejects.toThrow(
      new EmailAlreadyInUseError(anotherUser.email),
    )
  })

  it('should throw error if GetUserByEmailRepository throws error', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    getUserByEmailRepository.execute.mockRejectedValueOnce(new Error())
    const updateUserParams = {
      email: faker.internet.email(),
    }

    // act
    const result = sut.execute(userFixture.id, updateUserParams)

    // assert
    await expect(result).rejects.toThrow(Error)
  })

  it('should throw error if UpdateUserRepository throws error', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()
    updateUserRepository.execute.mockRejectedValueOnce(new Error())
    const updateUserParams = {
      email: faker.internet.email(),
    }

    // act
    const result = sut.execute(userFixture.id, updateUserParams)

    // assert
    await expect(result).rejects.toThrow(Error)
  })

  it('should call GetUserByEmailRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    getUserByEmailRepository.execute.mockResolvedValueOnce(userFixture)
    const updateUserParams = {
      email: faker.internet.email(),
    }

    // act
    await sut.execute(userFixture.id, updateUserParams)

    // assert
    expect(getUserByEmailRepository.execute).toHaveBeenCalledWith(
      updateUserParams.email,
    )
  })

  it('should call UpdateUserRepository with the correct parameters', async () => {
    // arrange
    const { sut, updateUserRepository } = makeSut()
    updateUserRepository.execute.mockResolvedValueOnce(userFixture)
    const updateUserParams = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    }

    // act
    await sut.execute(userFixture.id, updateUserParams)

    // assert
    expect(updateUserRepository.execute).toHaveBeenCalledWith(
      userFixture.id,
      updateUserParams,
    )
  })
})
