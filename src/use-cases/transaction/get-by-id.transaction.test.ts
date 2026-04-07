import { faker } from '@faker-js/faker'
import { ITransactionResponse } from '../../types'
import { GetTransactionByIdUseCase } from './get-by-id.transaction'

describe('GetTransactionByIdUseCase', () => {
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

  class GetTransactionByIdRepositoryStub {
    execute = jest.fn(async (): Promise<ITransactionResponse> => transaction)
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
    const result = await sut.execute(transaction.id)

    // assert
    expect(result).toEqual(transaction)
  })

  it('should throw a TransactionNotFoundError if the transaction is not found', async () => {
    // arrange
    const { sut, getTransactionByIdRepository } = makeSut()
    const transactionId = faker.string.uuid()
    getTransactionByIdRepository.execute.mockResolvedValueOnce(null as never)
    // act
    const result = await sut.execute(transactionId)

    // assert
    expect(getTransactionByIdRepository.execute).toHaveBeenCalledWith({
      transactionId: transactionId,
    })
    expect(result).toEqual(null)
  })

  it('should call GetTransactionByIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getTransactionByIdRepository } = makeSut()
    const transactionId = faker.string.uuid()
    const executeSpy = jest.spyOn(getTransactionByIdRepository, 'execute')
    // act
    await sut.execute(transactionId)
    // assert
    expect(executeSpy).toHaveBeenCalledWith({ transactionId: transactionId })
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, getTransactionByIdRepository } = makeSut()
    const transactionId = faker.string.uuid()
    getTransactionByIdRepository.execute.mockRejectedValueOnce(new Error())
    // act
    const result = sut.execute(transactionId)
    // assert
    await expect(result).rejects.toThrow(Error)
    expect(getTransactionByIdRepository.execute).toHaveBeenCalledWith({
      transactionId: transactionId,
    })
  })
})
