import { TransactionNotFoundError } from '@/errors/transaction'
import { transactionFixture } from '@/test/fixtures/transaction'
import { ITransactionResponse } from '@/types'
import { DeleteTransactionUseCase } from './delete.transaction'

describe('DeleteTransactionUseCase', () => {
  class DeleteTransactionRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse> => transactionFixture,
    )
  }
  class GetTransactionByIdRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse | null> => transactionFixture,
    )
  }
  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub()
    const getTransactionByIdRepository = new GetTransactionByIdRepositoryStub()
    const sut = new DeleteTransactionUseCase(
      deleteTransactionRepository,
      getTransactionByIdRepository,
    )
    return { sut, deleteTransactionRepository, getTransactionByIdRepository }
  }

  it('should delete a transaction', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(
      transactionFixture.id,
      transactionFixture.user_id,
    )
    expect(result).toEqual(transactionFixture)
  })

  it('should return null when the transaction is not found in repo step', async () => {
    const { sut, deleteTransactionRepository } = makeSut()
    deleteTransactionRepository.execute.mockResolvedValueOnce(null as never)
    const result = await sut.execute(
      transactionFixture.id,
      transactionFixture.user_id,
    )
    expect(deleteTransactionRepository.execute).toHaveBeenCalledWith(
      transactionFixture.id,
    )
    expect(result).toEqual(null)
  })

  it('should throw TransactionNotFoundError when transaction does not exist', async () => {
    const { sut, getTransactionByIdRepository } = makeSut()
    getTransactionByIdRepository.execute.mockResolvedValueOnce(null)
    const promise = sut.execute(
      transactionFixture.id,
      transactionFixture.user_id,
    )
    await expect(promise).rejects.toThrow(TransactionNotFoundError)
  })

  it('should throw TransactionNotFoundError when transaction belongs to another user', async () => {
    const { sut } = makeSut()
    const promise = sut.execute(transactionFixture.id, 'other-user-id')
    await expect(promise).rejects.toThrow(TransactionNotFoundError)
  })

  it('should call DeleteTransactionRepository with the correct parameters', async () => {
    const { sut, deleteTransactionRepository } = makeSut()
    const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute')
    await sut.execute(transactionFixture.id, transactionFixture.user_id)
    expect(executeSpy).toHaveBeenCalledWith(transactionFixture.id)
  })

  it('should propagate when DeleteTransactionRepository throws', async () => {
    const { sut, deleteTransactionRepository } = makeSut()
    jest
      .spyOn(deleteTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error())
    const promise = sut.execute(
      transactionFixture.id,
      transactionFixture.user_id,
    )
    await expect(promise).rejects.toThrow(Error)
  })
})
