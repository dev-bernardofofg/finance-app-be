import { faker } from '@faker-js/faker'
import { transactionFixture } from '../../test/fixtures/transaction'
import { ITransactionResponse } from '../../types'
import { UpdateTransactionUseCase } from './update.transaction'

describe('UpdateTransactionUseCase', () => {
  const updateTransactionParams = {
    user_id: transactionFixture.user_id,
    name: faker.person.firstName(),
    type: faker.helpers.arrayElement(['INCOME', 'EXPENSE', 'INVESTMENT']),
    amount: faker.number.int({ min: 1, max: 100000 }),
    date: faker.date.recent().toISOString(),
  }

  class UpdateTransactionRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse> => transactionFixture,
    )
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
    const result = await sut.execute(
      transactionFixture.id,
      updateTransactionParams,
    )
    // assert
    expect(result).toEqual(transactionFixture)
  })

  it('should return null if the transaction is not found', async () => {
    // arrange
    const { sut, updateTransactionRepositoryStub } = makeSut()
    updateTransactionRepositoryStub.execute.mockResolvedValueOnce(null as never)
    // act
    const result = await sut.execute(
      transactionFixture.id,
      updateTransactionParams,
    )
    // assert
    expect(result).toEqual(null)
    expect(updateTransactionRepositoryStub.execute).toHaveBeenCalledWith(
      transactionFixture.id,
      updateTransactionParams,
    )
  })

  it('should call UpdateTransactionRepository with the correct parameters', async () => {
    // arrange
    const { sut, updateTransactionRepositoryStub } = makeSut()
    const executeSpy = jest.spyOn(updateTransactionRepositoryStub, 'execute')
    // act
    await sut.execute(transactionFixture.id, updateTransactionParams)
    // assert
    expect(executeSpy).toHaveBeenCalledWith(
      transactionFixture.id,
      updateTransactionParams,
    )
  })

  it('should throw an error if the UpdateTransactionRepository throws an error', async () => {
    // arrange
    const { sut, updateTransactionRepositoryStub } = makeSut()
    updateTransactionRepositoryStub.execute.mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute(transactionFixture.id, updateTransactionParams)
    // assert
    await expect(promise).rejects.toThrow(Error)
  })
})
