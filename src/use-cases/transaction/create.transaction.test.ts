import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { CreateTransactionUseCase } from './create.transaction'

describe('CreateTransactionUseCase', () => {
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

  const generatedId = faker.string.uuid()

  class CreateTransactionRepositoryStub {
    execute = jest.fn(async () => transaction)
  }

  class GetUserByIdRepositoryStub {
    execute = jest.fn(async () => user)
  }

  class IdGeneratorAdapterStub {
    execute = jest.fn(async () => generatedId)
  }

  const makeSut = () => {
    const createTransactionRepository = new CreateTransactionRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()

    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    )

    return {
      sut,
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    }
  }

  it('should create a transaction successfully', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const result = await sut.execute(transaction)

    // assert
    expect(result).toEqual(transaction)
  })

  it('should throw a UserNotFoundError if the user is not found', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockResolvedValueOnce(null as never)

    // act
    const result = sut.execute(transaction)

    // assert
    await expect(result).rejects.toThrow(
      new UserNotFoundError(transaction.user_id),
    )
  })

  it('should throw an error if the id generator adapter throws an error', async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut()
    idGeneratorAdapter.execute.mockRejectedValueOnce(new Error())

    // act
    const result = sut.execute(transaction)

    // assert
    await expect(result).rejects.toThrow(Error)
  })

  it('should call CreateTransactionRepository with the correct parameters', async () => {
    // arrange
    const { sut, createTransactionRepository } = makeSut()

    // act
    await sut.execute(transaction)

    // assert
    expect(createTransactionRepository.execute).toHaveBeenCalledWith({
      ...transaction,
      id: generatedId,
    })
  })

  it('should call GetUserByIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()

    // act
    await sut.execute(transaction)

    // assert
    expect(getUserByIdRepository.execute).toHaveBeenCalledWith({
      id: transaction.user_id,
    })
  })
})
