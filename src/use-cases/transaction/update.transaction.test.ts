import { faker } from '@faker-js/faker'
import { ITransactionResponse } from '../../types'
import { UpdateTransactionUseCase } from './update.transaction'

describe('UpdateTransactionUseCase', () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.person.firstName(),
    type: faker.helpers.arrayElement(['INCOME', 'EXPENSE', 'INVESTMENT']),
    amount: faker.number.int({ min: 1, max: 100000 }),
    date: faker.date.recent().toISOString(),
  }

  const updateTransactionParams = {
    user_id: transaction.user_id,
    name: faker.person.firstName(),
    type: faker.helpers.arrayElement(['INCOME', 'EXPENSE', 'INVESTMENT']),
    amount: faker.number.int({ min: 1, max: 100000 }),
    date: faker.date.recent().toISOString(),
  }

  class UpdateTransactionRepositoryStub {
    execute = jest.fn(async (): Promise<ITransactionResponse> => transaction)
  }

  const makeSut = () => {
    const updateTransactionRepositoryStub =
      new UpdateTransactionRepositoryStub()
    const sut = new UpdateTransactionUseCase(updateTransactionRepositoryStub)
    return { sut, updateTransactionRepositoryStub }
  }

  it('should update a transaction successfully', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const result = await sut.execute(transaction.id, updateTransactionParams)
    // assert
    expect(result).toEqual(transaction)
  })

  it('should return null if the transaction is not found', async () => {
    // arrange
    const { sut, updateTransactionRepositoryStub } = makeSut()
    updateTransactionRepositoryStub.execute.mockResolvedValueOnce(null as never)
    // act
    const result = await sut.execute(transaction.id, updateTransactionParams)
    // assert
    expect(result).toEqual(null)
    expect(updateTransactionRepositoryStub.execute).toHaveBeenCalledWith(
      transaction.id,
      updateTransactionParams,
    )
  })

  it('should call UpdateTransactionRepository with the correct parameters', async () => {
    // arrange
    const { sut, updateTransactionRepositoryStub } = makeSut()
    const transactionId = faker.string.uuid()
    const executeSpy = jest.spyOn(updateTransactionRepositoryStub, 'execute')
    // act
    await sut.execute(transactionId, updateTransactionParams)
    // assert
    expect(executeSpy).toHaveBeenCalledWith(
      transactionId,
      updateTransactionParams,
    )
  })

  it('should throw an error if the UpdateTransactionRepository throws an error', async () => {
    // arrange
    const { sut, updateTransactionRepositoryStub } = makeSut()
    updateTransactionRepositoryStub.execute.mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute(transaction.id, updateTransactionParams)
    // assert
    await expect(promise).rejects.toThrow(Error)
  })
})
