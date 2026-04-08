import { UserNotFoundError } from '../../errors/user'
import { GetBalanceUserResponse } from '../../repositories/postgres'
import { balanceFixture } from '../../test/fixtures/balance'
import { userFixture } from '../../test/fixtures/user'
import { UserResponse } from '../../types'
import { GetBalanceUserUseCase } from './get-balance.user'

describe('GetBalanceUserUseCase', () => {
  class GetBalanceUserUseCaseStub {
    execute = jest.fn(
      async (): Promise<GetBalanceUserResponse> => balanceFixture,
    )
  }

  class GetUserByIdRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse> => userFixture)
  }

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
    getUserByIdRepository.execute.mockResolvedValueOnce(userFixture)

    // act
    const balance = await sut.execute(userFixture.id)

    // assert
    expect(getUserByIdRepository.execute).toHaveBeenCalledWith({
      id: userFixture.id,
    })
    expect(getBalanceUserUseCaseStub.execute).toHaveBeenCalledWith({
      id: userFixture.id,
    })
    expect(balance).toBeTruthy()
  })

  it('should throw UserNotFoundError if user not found', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockResolvedValueOnce(null as never)

    // act
    const promise = sut.execute(userFixture.id)

    // assert
    await expect(promise).rejects.toThrow(UserNotFoundError)
  })

  it('should call GetUserByIdRepository with the correct parameters', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

    // act
    await sut.execute(userFixture.id)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ id: userFixture.id })
  })

  it('should call GetBalanceUserUseCase with the correct parameters', async () => {
    // arrange
    const { sut, getBalanceUserUseCaseStub } = makeSut()
    const executeSpy = jest.spyOn(getBalanceUserUseCaseStub, 'execute')

    // act
    await sut.execute(userFixture.id)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ id: userFixture.id })
  })

  it('should throw error if GetBalanceUserUseCase throws error', async () => {
    // arrange
    const { sut, getBalanceUserUseCaseStub } = makeSut()
    getBalanceUserUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(userFixture.id)

    // assert
    await expect(promise).rejects.toThrow(Error)
    expect(getBalanceUserUseCaseStub.execute).toHaveBeenCalled()
  })
})
