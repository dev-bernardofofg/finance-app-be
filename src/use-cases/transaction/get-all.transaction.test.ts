import { faker } from '@faker-js/faker'
import { ITransactionResponse } from '../../types'
import { GetAllTransactionsUseCase } from './get-all.transaction'

describe('GetAllTransactionsUseCase', () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.person.firstName(),
    type: faker.helpers.arrayElement(['INCOME', 'EXPENSE', 'INVESTMENT']),
    amount: Number(faker.finance.amount()),
    date: faker.date.recent().toISOString(),
  }

  class GetAllTransactionsRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse[]> => [transaction],
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
    const transactions = [transaction]

    // act
    const result = await sut.execute({ user_id: transaction.user_id })

    // assert
    expect(result).toEqual(transactions)
  })

  it('should return null when there are no transactions', async () => {
    // arrange
    const { sut, getAllTransactionsRepository } = makeSut()
    const user_id = faker.string.uuid()
    getAllTransactionsRepository.execute.mockResolvedValueOnce(null as never)
    // act
    await sut.execute({ user_id })

    // assert
    expect(getAllTransactionsRepository.execute).toHaveBeenCalledWith({
      user_id,
    })
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, getAllTransactionsRepository } = makeSut()
    const user_id = faker.string.uuid()
    getAllTransactionsRepository.execute.mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute({ user_id })

    // assert
    await expect(promise).rejects.toThrow(Error)
    expect(getAllTransactionsRepository.execute).toHaveBeenCalledWith({
      user_id,
    })
  })

  it('should call GetAllTransactionsRepository with the correct parameters', async () => {
    // arrange
    const { sut, getAllTransactionsRepository } = makeSut()
    const user_id = faker.string.uuid()
    const executeSpy = jest.spyOn(getAllTransactionsRepository, 'execute')

    // act
    await sut.execute({ user_id })

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ user_id })
  })

  it('should call GetAllTransactionsRepository with the correct parameters', async () => {
    // arrange
    const { sut, getAllTransactionsRepository } = makeSut()
    const user_id = faker.string.uuid()
    const executeSpy = jest.spyOn(getAllTransactionsRepository, 'execute')

    // act
    await sut.execute({ user_id })

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ user_id })
  })

  it('should call GetAllTransactionsRepository with the correct parameters', async () => {
    // arrange
    const { sut, getAllTransactionsRepository } = makeSut()
    const user_id = faker.string.uuid()
    const executeSpy = jest.spyOn(getAllTransactionsRepository, 'execute')

    // act
    await sut.execute({ user_id })

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ user_id })
  })
})
