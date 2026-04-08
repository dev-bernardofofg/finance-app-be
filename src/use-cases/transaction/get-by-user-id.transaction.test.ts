import { UserNotFoundError } from '../../errors/user'
import { transactionFixture } from '../../test/fixtures/transaction'
import { userFixture } from '../../test/fixtures/user'
import { ITransactionResponse, UserResponse } from '../../types'
import { GetTransactionByUserIdUseCase } from './get-by-user-id.transaction'

describe('GetTransactionByUserIdUseCase', () => {
  class GetTransactionByUserIdRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse[]> => [transactionFixture],
    )
  }

  class GetUserByIdRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse> => userFixture)
  }

  const makeSut = () => {
    const getTransactionByUserIdRepository =
      new GetTransactionByUserIdRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const sut = new GetTransactionByUserIdUseCase(
      getTransactionByUserIdRepository,
      getUserByIdRepository,
    )
    return { sut, getTransactionByUserIdRepository, getUserByIdRepository }
  }

  it('should return the transactions by user id successfully', async () => {
    // arrange
    const { sut, getTransactionByUserIdRepository, getUserByIdRepository } =
      makeSut()
    // act
    const result = await sut.execute({ userId: transactionFixture.user_id })
    // assert
    expect(getTransactionByUserIdRepository.execute).toHaveBeenCalledWith(
      transactionFixture.user_id,
    )
    expect(getUserByIdRepository.execute).toHaveBeenCalledWith({
      id: transactionFixture.user_id,
    })
    expect(result).toEqual([transactionFixture])
  })

  it('should throw UserNotFoundError if user not found', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockResolvedValueOnce(null as never)
    // act
    const promise = sut.execute({ userId: transactionFixture.user_id })
    // assert
    await expect(promise).rejects.toThrow(UserNotFoundError)
  })

  it('should call GetTransactionByUserIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getTransactionByUserIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getTransactionByUserIdRepository, 'execute')
    // act
    await sut.execute({ userId: userFixture.id })
    // assert
    expect(executeSpy).toHaveBeenCalledWith(userFixture.id)
  })

  it('should call GetUserByIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
    // act
    await sut.execute({ userId: userFixture.id })
    // assert
    expect(executeSpy).toHaveBeenCalledWith({ id: userFixture.id })
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, getTransactionByUserIdRepository, getUserByIdRepository } =
      makeSut()
    getTransactionByUserIdRepository.execute.mockRejectedValueOnce(new Error())
    getUserByIdRepository.execute.mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute({ userId: userFixture.id })
    // assert
    await expect(promise).rejects.toThrow(Error)
  })
})
