import { faker } from '@faker-js/faker'
import { UserResponse } from '../../types'
import { DeleteUserUseCase } from './delete.user'

describe('DeleteUserUseCase', () => {
  const makeUser = (): UserResponse => ({
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
  })

  class DeleteUserRepositoryStub {
    execute = jest.fn(async (): Promise<UserResponse | null> => makeUser())
  }

  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoryStub()
    const sut = new DeleteUserUseCase(deleteUserRepository)
    return { sut, deleteUserRepository }
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should delete user successfully', async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut()
    const user = makeUser()
    deleteUserRepository.execute.mockResolvedValueOnce(user)

    // act
    const result = await sut.execute(user.id)

    // assert
    expect(deleteUserRepository.execute).toHaveBeenCalledWith(user.id)
    expect(result).toEqual(user)
  })

  it('should call DeleteUserRepository with correct userId', async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut()
    const user = makeUser()
    deleteUserRepository.execute.mockResolvedValueOnce(user)

    // act
    await sut.execute(user.id)

    // assert
    expect(deleteUserRepository.execute).toHaveBeenCalledWith(user.id)
  })

  it('should return null when repository returns null', async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut()
    const user = makeUser()
    deleteUserRepository.execute.mockResolvedValueOnce(null)

    // act
    const result = await sut.execute(user.id)

    // assert
    expect(result).toEqual(null)
    expect(deleteUserRepository.execute).toHaveBeenCalledWith(user.id)
  })

  it('should propagate unexpected errors', async () => {
    // arrange
    const { sut, deleteUserRepository } = makeSut()
    const user = makeUser()
    const unexpectedError = new Error('unexpected')
    deleteUserRepository.execute.mockRejectedValueOnce(unexpectedError)

    // act
    const result = sut.execute(user.id)

    // assert
    await expect(result).rejects.toThrow(unexpectedError)
    expect(deleteUserRepository.execute).toHaveBeenCalledWith(user.id)
  })
})
