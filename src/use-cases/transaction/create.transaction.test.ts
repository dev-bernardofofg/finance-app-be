import { UserNotFoundError } from '../../errors/user'
import { idFixture } from '../../test/fixtures/id'
import { transactionFixture } from '../../test/fixtures/transaction'
import { userFixture } from '../../test/fixtures/user'
import { ITransactionResponse } from '../../types'
import { CreateTransactionUseCase } from './create.transaction'

describe('CreateTransactionUseCase', () => {
  const user = {
    id: transactionFixture.user_id,
    first_name: userFixture.first_name,
    last_name: userFixture.last_name,
    email: userFixture.email,
  }

  class CreateTransactionRepositoryStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse> => transactionFixture,
    )
  }

  class GetUserByIdRepositoryStub {
    execute = jest.fn(async () => user)
  }

  class IdGeneratorAdapterStub {
    execute = jest.fn(async () => idFixture)
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
    const result = await sut.execute(transactionFixture)

    // assert
    expect(result).toEqual(transactionFixture)
  })

  it('should throw a UserNotFoundError if the user is not found', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockResolvedValueOnce(null as never)

    // act
    const result = sut.execute(transactionFixture)

    // assert
    await expect(result).rejects.toThrow(
      new UserNotFoundError(transactionFixture.user_id),
    )
  })

  it('should throw an error if the id generator adapter throws an error', async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut()
    idGeneratorAdapter.execute.mockRejectedValueOnce(new Error())

    // act
    const result = sut.execute(transactionFixture)

    // assert
    await expect(result).rejects.toThrow(Error)
  })

  it('should call CreateTransactionRepository with the correct parameters', async () => {
    // arrange
    const { sut, createTransactionRepository } = makeSut()
    const executeSpy = jest.spyOn(createTransactionRepository, 'execute')
    // act
    await sut.execute(transactionFixture)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({
      ...transactionFixture,
      id: idFixture,
    })
  })

  it('should call GetUserByIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')
    // act
    await sut.execute(transactionFixture)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({
      id: transactionFixture.user_id,
    })
  })

  it('should call IdGeneratorAdapter with the correct parameters', async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut()
    const executeSpy = jest.spyOn(idGeneratorAdapter, 'execute')
    // act
    await sut.execute(transactionFixture)

    // assert
    expect(executeSpy).toHaveBeenCalled()
  })
})
