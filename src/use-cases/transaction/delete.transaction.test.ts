import { transactionFixture } from '../../test/fixtures/transaction'
import { ITransactionResponse } from '../../types'
import { DeleteTransactionUseCase } from './delete.transaction'

describe('DeleteTransactionUseCase', () => {
  class DeleteTransactionRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse> => transactionFixture,
    )
  }
  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub()
    const sut = new DeleteTransactionUseCase(deleteTransactionRepository)
    return { sut, deleteTransactionRepository }
  }

  it('should delete a transaction', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const result = await sut.execute(transactionFixture.id)

    // assert
    expect(result).toEqual(transactionFixture)
  })

  it('should return null when the transaction is not found', async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut()
    deleteTransactionRepository.execute.mockResolvedValueOnce(null as never)
    // act
    const result = await sut.execute(transactionFixture.id)

    // assert
    expect(deleteTransactionRepository.execute).toHaveBeenCalledWith(
      transactionFixture.id,
    )
    expect(result).toEqual(null)
  })

  it('should call DeleteTransactionRepository with the correct parameters', async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut()
    const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute')
    // act
    await sut.execute(transactionFixture.id)
    // assert
    expect(executeSpy).toHaveBeenCalledWith(transactionFixture.id)
  })

  it('should call DeleteTransactionRepository throws', async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut()
    jest
      .spyOn(deleteTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute(transactionFixture.id)
    // assert
    await expect(promise).rejects.toThrow(Error)
  })
})
