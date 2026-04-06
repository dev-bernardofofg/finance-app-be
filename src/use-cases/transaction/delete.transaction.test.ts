import { faker } from '@faker-js/faker'
import { ITransactionResponse } from '../../types'
import { DeleteTransactionUseCase } from './delete.transaction'

describe('DeleteTransactionUseCase', () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.person.firstName(),
    type: faker.helpers.arrayElement(['INCOME', 'EXPENSE', 'INVESTMENT']),
    amount: Number(faker.finance.amount()),
    date: faker.date.recent().toISOString(),
    created_at: faker.date.recent().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }

  class DeleteTransactionRepositoryStub {
    execute = jest.fn(async (): Promise<ITransactionResponse> => transaction)
  }
  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub()
    const sut = new DeleteTransactionUseCase(deleteTransactionRepository)
    return { sut, deleteTransactionRepository }
  }

  it('should delete a transaction', async () => {
    // arrange
    const { sut } = makeSut()
    const transactionId = transaction.id

    // act
    const result = await sut.execute(transactionId)

    // assert
    expect(result).toEqual(transaction)
  })

  it('should return null when the transaction is not found', async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut()
    const transactionId = faker.string.uuid()
    const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute')

    // act
    await sut.execute(transactionId)

    // assert
    expect(deleteTransactionRepository.execute).toHaveBeenCalledWith(
      transactionId,
    )
    expect(executeSpy).toHaveBeenCalledWith(transactionId)
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut()
    const transactionId = faker.string.uuid()
    const unexpectedError = new Error('unexpected')
    deleteTransactionRepository.execute.mockRejectedValueOnce(unexpectedError)

    // act
    const promise = sut.execute(transactionId)

    // assert
    await expect(promise).rejects.toThrow(unexpectedError)
    expect(deleteTransactionRepository.execute).toHaveBeenCalledWith(
      transactionId,
    )
  })
})
