import { UserNotFoundError } from '../../errors/user'
import { userFixture } from '../../test/fixtures/user'
import { UserResponse } from '../../types'
import { GetUserByIdUseCase } from './get-by-id.user'

describe('GetByIdUserUseCase', () => {
  class GetUserByIdRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse> => userFixture)
  }

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const sut = new GetUserByIdUseCase(getUserByIdRepository)
    return { sut, getUserByIdRepository }
  }

  it('should return the user by id', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockResolvedValueOnce(userFixture)

    // act
    const result = await sut.execute(userFixture.id)

    // assert
    expect(getUserByIdRepository.execute).toHaveBeenCalledWith({
      id: userFixture.id,
    })
    expect(result).toEqual(userFixture)
  })

  it('should throw UserNotFoundError if user not found', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockResolvedValueOnce(null as never)

    // act
    const promise = sut.execute(userFixture.id)

    // assert
    await expect(promise).rejects.toThrow(UserNotFoundError)
  })

  it('should call GetUserByIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

    // act
    await sut.execute(userFixture.id)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ id: userFixture.id })
  })

  it('should call GetUserByIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

    // act
    await sut.execute(userFixture.id)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ id: userFixture.id })
  })

  it('should throw error if GetUserByIdRepository throws error', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(userFixture.id)

    // assert
    await expect(promise).rejects.toThrow(Error)
  })
})
