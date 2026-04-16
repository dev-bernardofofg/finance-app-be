import { TransactionNotFoundError } from '../../errors/transaction'
import { transactionFixture } from '../../test/fixtures/transaction'
import { ITransactionResponse } from '../../types'
import { GetTransactionByIdUseCase } from './get-by-id.transaction'

describe('GetTransactionByIdUseCase', () => {
  class GetTransactionByIdRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse> => transactionFixture,
    )
  }

  const makeSut = () => {
    const getTransactionByIdRepository = new GetTransactionByIdRepositoryStub()
    const sut = new GetTransactionByIdUseCase(getTransactionByIdRepository)
    return { sut, getTransactionByIdRepository }
  }

  it('should return a transaction by id', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const result = await sut.execute(transactionFixture.id)

    // assert
    expect(result).toEqual(transactionFixture)
  })

  it('should throw a TransactionNotFoundError if the transaction is not found', async () => {
    // arrange
    const { sut, getTransactionByIdRepository } = makeSut()
    getTransactionByIdRepository.execute.mockResolvedValueOnce(null as never)
    // act
    const promise = sut.execute(transactionFixture.id)
    // assert
    await expect(promise).rejects.toThrow(TransactionNotFoundError)
    expect(getTransactionByIdRepository.execute).toHaveBeenCalledWith({
      transactionId: transactionFixture.id,
    })
  })

  it('should call GetTransactionByIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getTransactionByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getTransactionByIdRepository, 'execute')
    // act
    await sut.execute(transactionFixture.id)
    // assert
    expect(executeSpy).toHaveBeenCalledWith({
      transactionId: transactionFixture.id,
    })
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, getTransactionByIdRepository } = makeSut()
    getTransactionByIdRepository.execute.mockRejectedValueOnce(new Error())
    // act
    const result = sut.execute(transactionFixture.id)
    // assert
    await expect(result).rejects.toThrow(Error)
    expect(getTransactionByIdRepository.execute).toHaveBeenCalledWith({
      transactionId: transactionFixture.id,
    })
  })
})
