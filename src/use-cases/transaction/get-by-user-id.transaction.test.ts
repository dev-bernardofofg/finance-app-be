import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { ITransactionResponse, UserResponse } from '../../types'
import { GetTransactionByUserIdUseCase } from './get-by-user-id.transaction'

describe('GetTransactionByUserIdUseCase', () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.person.firstName(),
    type: faker.helpers.arrayElement(['INCOME', 'EXPENSE', 'INVESTMENT']),
    amount: Number(faker.finance.amount()),
    date: faker.date.recent().toISOString(),
  }

  const user = {
    id: transaction.user_id,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
  }

  class GetTransactionByUserIdRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse[]> => [transaction],
    )
  }

  class GetUserByIdRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse> => user)
  }

  const makeSut = () => {
    const getTransactionByUserIdRepository =
      new GetTransactionByUserIdRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const sut = new GetTransactionByUserIdUseCase(
      getTransactionByUserIdRepository,
      getUserByIdRepository,
    )
    return { sut, getTransactionByUserIdRepository, getUserByIdRepository }
  }

  it('should return the transactions by user id successfully', async () => {
    // arrange
    const { sut, getTransactionByUserIdRepository, getUserByIdRepository } =
      makeSut()
    // act
    const result = await sut.execute({ userId: transaction.user_id })
    // assert
    expect(getTransactionByUserIdRepository.execute).toHaveBeenCalledWith(
      transaction.user_id,
    )
    expect(getUserByIdRepository.execute).toHaveBeenCalledWith({
      id: transaction.user_id,
    })
    expect(result).toEqual([transaction])
  })

  it('should throw UserNotFoundError if user not found', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockResolvedValueOnce(null as never)
    // act
    const promise = sut.execute({ userId: transaction.user_id })
    // assert
    await expect(promise).rejects.toThrow(UserNotFoundError)
  })

  it('should call GetTransactionByUserIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getTransactionByUserIdRepository } = makeSut()
    const userId = faker.string.uuid()
    const executeSpy = jest.spyOn(getTransactionByUserIdRepository, 'execute')
    // act
    await sut.execute({ userId })
    // assert
    expect(executeSpy).toHaveBeenCalledWith(userId)
  })

  it('should call GetUserByIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    const userId = faker.string.uuid()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
    // act
    await sut.execute({ userId })
    // assert
    expect(executeSpy).toHaveBeenCalledWith({ id: userId })
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, getTransactionByUserIdRepository, getUserByIdRepository } =
      makeSut()
    getTransactionByUserIdRepository.execute.mockRejectedValueOnce(new Error())
    getUserByIdRepository.execute.mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute({ userId: transaction.user_id })
    // assert
    await expect(promise).rejects.toThrow(Error)
  })
})
