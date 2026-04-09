import { prisma } from '../../../prisma/prisma'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresCreateUserRepository } from './create.user'

describe('PostgresCreateUserRepository', () => {
  it('should create a user successfully', async () => {
    // arrange
    const sut = new PostgresCreateUserRepository()
    // act
    const result = await sut.execute(userFixture)
    // assert
    expect(result.id).toBe(userFixture.id)
    expect(result.first_name).toBe(userFixture.first_name)
    expect(result.last_name).toBe(userFixture.last_name)
    expect(result.email).toBe(userFixture.email)
  })

  it('should call Prisma to correct parameters', async () => {
    // arrange
    const sut = new PostgresCreateUserRepository()
    const createUserSpy = jest.spyOn(prisma.user, 'create')
    // act
    await sut.execute(userFixture)
    // assert
    expect(createUserSpy).toHaveBeenCalledWith({
      data: userFixture,
    })
  })

  it('should throw if Prisma throws', async () => {
    const sut = new PostgresCreateUserRepository()
    jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(new Error())

    const promise = sut.execute(userFixture)

    await expect(promise).rejects.toThrow()
  })
})
