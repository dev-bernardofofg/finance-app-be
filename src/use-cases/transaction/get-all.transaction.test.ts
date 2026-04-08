import { transactionFixture } from '../../test/fixtures/transaction'
import { userFixture } from '../../test/fixtures/user'
import { ITransactionResponse } from '../../types'
import { GetAllTransactionsUseCase } from './get-all.transaction'

describe('GetAllTransactionsUseCase', () => {
  class GetAllTransactionsRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse[]> => [transactionFixture],
    )
  }

  const makeSut = () => {
    const getAllTransactionsRepository = new GetAllTransactionsRepositoryStub()

    const sut = new GetAllTransactionsUseCase(getAllTransactionsRepository)

    return { sut, getAllTransactionsRepository }
  }

  it('should return all transactions', async () => {
    // arrange
    const { sut } = makeSut()
    const transactions = [transactionFixture]

    // act
    const result = await sut.execute({ user_id: transactionFixture.user_id })

    // assert
    expect(result).toEqual(transactions)
  })

  it('should return null when there are no transactions', async () => {
    // arrange
    const { sut, getAllTransactionsRepository } = makeSut()
    getAllTransactionsRepository.execute.mockResolvedValueOnce(null as never)
    // act
    await sut.execute({ user_id: userFixture.id })

    // assert
    expect(getAllTransactionsRepository.execute).toHaveBeenCalledWith({
      user_id: userFixture.id,
    })
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, getAllTransactionsRepository } = makeSut()
    getAllTransactionsRepository.execute.mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute({ user_id: userFixture.id })

    // assert
    await expect(promise).rejects.toThrow(Error)
    expect(getAllTransactionsRepository.execute).toHaveBeenCalledWith({
      user_id: userFixture.id,
    })
  })

  it('should call GetAllTransactionsRepository with the correct parameters', async () => {
    // arrange
    const { sut, getAllTransactionsRepository } = makeSut()
    const executeSpy = jest.spyOn(getAllTransactionsRepository, 'execute')

    // act
    await sut.execute({ user_id: userFixture.id })

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ user_id: userFixture.id })
  })

  it('should call GetAllTransactionsRepository with the correct parameters', async () => {
    // arrange
    const { sut, getAllTransactionsRepository } = makeSut()
    const executeSpy = jest.spyOn(getAllTransactionsRepository, 'execute')

    // act
    await sut.execute({ user_id: userFixture.id })

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ user_id: userFixture.id })
  })

  it('should call GetAllTransactionsRepository with the correct parameters', async () => {
    // arrange
    const { sut, getAllTransactionsRepository } = makeSut()
    const executeSpy = jest.spyOn(getAllTransactionsRepository, 'execute')

    // act
    await sut.execute({ user_id: userFixture.id })

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ user_id: userFixture.id })
  })
})
