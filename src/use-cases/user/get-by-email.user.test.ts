import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { UserResponse } from '../../types'
import { GetUserByEmailUseCase } from './get-by-email.user'

describe('GetUserByEmailUseCase', () => {
  const user = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
  }

  class GetUserByEmailRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse> => user)
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const sut = new GetUserByEmailUseCase(getUserByEmailRepository)
    return { sut, getUserByEmailRepository }
  }

  it('should return the user by email successfully', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    // act
    const result = await sut.execute({ email: user.email })

    // assert
    expect(getUserByEmailRepository.execute).toHaveBeenCalledWith({
      email: user.email,
    })
    expect(result).toEqual(user)
  })

  it('should throw UserNotFoundError if user not found', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    getUserByEmailRepository.execute.mockResolvedValueOnce(null as never)
    // act
    const promise = sut.execute({ email: faker.internet.email() })
    // assert
    await expect(promise).rejects.toThrow(UserNotFoundError)
  })

  it('should call GetUserByEmailRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByEmailRepository, 'execute')
    // act
    await sut.execute({ email: user.email })
    // assert
    expect(executeSpy).toHaveBeenCalledWith({ email: user.email })
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    getUserByEmailRepository.execute.mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute({ email: user.email })
    // assert
    await expect(promise).rejects.toThrow(Error)
  })
})
