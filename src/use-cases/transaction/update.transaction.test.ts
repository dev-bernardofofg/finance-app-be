import { faker } from '@faker-js/faker'
import { TransactionNotFoundError } from '@/errors/transaction'
import { transactionFixture } from '@/test/fixtures/transaction'
import { ITransactionResponse } from '@/types'
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
  class GetTransactionByIdRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse | null> => transactionFixture,
    )
  }

  const makeSut = () => {
    const updateTransactionRepositoryStub =
      new UpdateTransactionRepositoryStub()
    const getTransactionByIdRepositoryStub =
      new GetTransactionByIdRepositoryStub()
    const sut = new UpdateTransactionUseCase(
      updateTransactionRepositoryStub,
      getTransactionByIdRepositoryStub,
    )
    return {
      sut,
      updateTransactionRepositoryStub,
      getTransactionByIdRepositoryStub,
    }
  }

  it('should update a transaction successfully', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(
      transactionFixture.id,
      transactionFixture.user_id,
      updateTransactionParams,
    )
    expect(result).toEqual(transactionFixture)
  })

  it('should return null if the update repo returns null', async () => {
    const { sut, updateTransactionRepositoryStub } = makeSut()
    updateTransactionRepositoryStub.execute.mockResolvedValueOnce(null as never)
    const result = await sut.execute(
      transactionFixture.id,
      transactionFixture.user_id,
      updateTransactionParams,
    )
    expect(result).toEqual(null)
    expect(updateTransactionRepositoryStub.execute).toHaveBeenCalledWith(
      transactionFixture.id,
      updateTransactionParams,
    )
  })

  it('should throw TransactionNotFoundError when transaction does not exist', async () => {
    const { sut, getTransactionByIdRepositoryStub } = makeSut()
    getTransactionByIdRepositoryStub.execute.mockResolvedValueOnce(null)
    const promise = sut.execute(
      transactionFixture.id,
      transactionFixture.user_id,
      updateTransactionParams,
    )
    await expect(promise).rejects.toThrow(TransactionNotFoundError)
  })

  it('should throw TransactionNotFoundError when transaction belongs to another user', async () => {
    const { sut } = makeSut()
    const promise = sut.execute(
      transactionFixture.id,
      'other-user-id',
      updateTransactionParams,
    )
    await expect(promise).rejects.toThrow(TransactionNotFoundError)
  })

  it('should call UpdateTransactionRepository with the correct parameters', async () => {
    const { sut, updateTransactionRepositoryStub } = makeSut()
    const executeSpy = jest.spyOn(updateTransactionRepositoryStub, 'execute')
    await sut.execute(
      transactionFixture.id,
      transactionFixture.user_id,
      updateTransactionParams,
    )
    expect(executeSpy).toHaveBeenCalledWith(
      transactionFixture.id,
      updateTransactionParams,
    )
  })

  it('should propagate when UpdateTransactionRepository throws', async () => {
    const { sut, updateTransactionRepositoryStub } = makeSut()
    updateTransactionRepositoryStub.execute.mockRejectedValueOnce(new Error())
    const promise = sut.execute(
      transactionFixture.id,
      transactionFixture.user_id,
      updateTransactionParams,
    )
    await expect(promise).rejects.toThrow(Error)
  })
})
