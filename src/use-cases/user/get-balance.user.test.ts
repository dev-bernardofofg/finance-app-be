import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { GetBalanceUserResponse } from '../../repositories/postgres'
import { UserResponse } from '../../types'
import { GetBalanceUserUseCase } from './get-balance.user'

describe('GetBalanceUserUseCase', () => {
  class GetBalanceUserUseCaseStub {
    execute = jest.fn(
      async (): Promise<GetBalanceUserResponse> => ({
        total_income: Number(faker.finance.amount()),
        total_expenses: Number(faker.finance.amount()),
        total_investments: Number(faker.finance.amount()),
        balance: Number(faker.finance.amount()),
      }),
    )
  }

  class GetUserByIdRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse> => makeUser())
  }

  const makeUser = () => ({
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
  })

  const makeSut = () => {
    const getBalanceUserUseCaseStub = new GetBalanceUserUseCaseStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const sut = new GetBalanceUserUseCase(
      getBalanceUserUseCaseStub,
      getUserByIdRepository,
    )
    return { sut, getBalanceUserUseCaseStub, getUserByIdRepository }
  }

  it('should return the balance of the user', async () => {
    // arrange
    const { sut, getBalanceUserUseCaseStub, getUserByIdRepository } = makeSut()
    const user = makeUser()
    getUserByIdRepository.execute.mockResolvedValueOnce(user)

    // act
    const balance = await sut.execute(user.id)

    // assert
    expect(getUserByIdRepository.execute).toHaveBeenCalledWith({ id: user.id })
    expect(getBalanceUserUseCaseStub.execute).toHaveBeenCalledWith({
      id: user.id,
    })
    expect(balance).toBeTruthy()
  })

  it('should throw UserNotFoundError if user not found', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockResolvedValueOnce(null as never)

    // act
    const promise = sut.execute(makeUser().id)

    // assert
    await expect(promise).rejects.toThrow(UserNotFoundError)
  })

  it('should call GetUserByIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    const user = makeUser()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

    // act
    await sut.execute(user.id)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ id: user.id })
  })

  it('should call GetBalanceUserUseCase with the correct parameters', async () => {
    // arrange
    const { sut, getBalanceUserUseCaseStub } = makeSut()
    const user = makeUser()
    const executeSpy = jest.spyOn(getBalanceUserUseCaseStub, 'execute')

    // act
    await sut.execute(user.id)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ id: user.id })
  })

  it('should throw error if GetBalanceUserUseCase throws error', async () => {
    // arrange
    const { sut, getBalanceUserUseCaseStub } = makeSut()
    getBalanceUserUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(makeUser().id)

    // assert
    await expect(promise).rejects.toThrow(Error)
    expect(getBalanceUserUseCaseStub.execute).toHaveBeenCalled()
  })
})
