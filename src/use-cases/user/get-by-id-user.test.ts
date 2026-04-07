import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { UserResponse } from '../../types'
import { GetUserByIdUseCase } from './get-by-id.user'

describe('GetByIdUserUseCase', () => {
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
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const sut = new GetUserByIdUseCase(getUserByIdRepository)
    return { sut, getUserByIdRepository }
  }

  it('should return the user by id', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    const user = makeUser()
    getUserByIdRepository.execute.mockResolvedValueOnce(user)

    // act
    const result = await sut.execute(user.id)

    // assert
    expect(getUserByIdRepository.execute).toHaveBeenCalledWith({ id: user.id })
    expect(result).toEqual(user)
  })

  it('should throw UserNotFoundError if user not found', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockResolvedValueOnce(null as never)

    // act
    const promise = sut.execute(faker.string.uuid())

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

  it('should throw error if GetUserByIdRepository throws error', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    getUserByIdRepository.execute.mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(faker.string.uuid())

    // assert
    await expect(promise).rejects.toThrow(Error)
  })
})
