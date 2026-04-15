import { UserNotFoundError } from '../../errors/user'
import { userFixture } from '../../test/fixtures/user'
import { UserResponse } from '../../types'
import { GetUserByEmailUseCase } from './get-by-email.user'

describe('GetUserByEmailUseCase', () => {
  class GetUserByEmailRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse> => userFixture)
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
    const result = await sut.execute(userFixture.email)

    // assert
    expect(getUserByEmailRepository.execute).toHaveBeenCalledWith(
      userFixture.email,
    )
    expect(result).toEqual(userFixture)
  })

  it('should throw UserNotFoundError if user not found', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    getUserByEmailRepository.execute.mockResolvedValueOnce(null as never)
    // act
    const promise = sut.execute(userFixture.email)
    // assert
    await expect(promise).rejects.toThrow(UserNotFoundError)
  })

  it('should call GetUserByEmailRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByEmailRepository, 'execute')
    // act
    await sut.execute(userFixture.email)
    // assert
    expect(executeSpy).toHaveBeenCalledWith(userFixture.email)
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    getUserByEmailRepository.execute.mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute(userFixture.email)
    // assert
    await expect(promise).rejects.toThrow(Error)
  })
})
