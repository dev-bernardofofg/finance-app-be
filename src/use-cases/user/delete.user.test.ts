import { userFixture } from '../../test/fixtures/user'
import { UserResponse } from '../../types'
import { DeleteUserUseCase } from './delete.user'

describe('DeleteUserUseCase', () => {
  class DeleteUserRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse | null> => userFixture)
  }

  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoryStub()
    const sut = new DeleteUserUseCase(deleteUserRepository)
    return { sut, deleteUserRepository }
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should delete user successfully', async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut()
    deleteUserRepository.execute.mockResolvedValueOnce(userFixture)

    // act
    const result = await sut.execute(userFixture.id)

    // assert
    expect(deleteUserRepository.execute).toHaveBeenCalledWith(userFixture.id)
    expect(result).toEqual(userFixture)
  })

  it('should call DeleteUserRepository with correct userId', async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut()
    deleteUserRepository.execute.mockResolvedValueOnce(userFixture)

    // act
    await sut.execute(userFixture.id)

    // assert
    expect(deleteUserRepository.execute).toHaveBeenCalledWith(userFixture.id)
  })

  it('should return null when repository returns null', async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut()
    deleteUserRepository.execute.mockResolvedValueOnce(null)

    // act
    const result = await sut.execute(userFixture.id)

    // assert
    expect(result).toEqual(null)
    expect(deleteUserRepository.execute).toHaveBeenCalledWith(userFixture.id)
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut()
    const unexpectedError = new Error('unexpected')
    deleteUserRepository.execute.mockRejectedValueOnce(unexpectedError)

    // act
    const result = sut.execute(userFixture.id)

    // assert
    await expect(result).rejects.toThrow(unexpectedError)
    expect(deleteUserRepository.execute).toHaveBeenCalledWith(userFixture.id)
  })
})
