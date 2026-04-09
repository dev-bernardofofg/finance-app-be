import { prisma } from '../../../prisma/prisma'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresDeleteUserRepository } from './delete.user'

describe('PostgresDeleteUserRepository', () => {
  it('should delete a user successfully', async () => {
    // arrange
    await prisma.user.create({
      data: userFixture,
    })
    const sut = new PostgresDeleteUserRepository()
    // act
    const result = await sut.execute(userFixture.id)
    // assert
    expect(result).toMatchObject(userFixture)
  })

  it('should call Prisma to correct parameters', async () => {
    // arrange
    await prisma.user.create({
      data: userFixture,
    })
    const sut = new PostgresDeleteUserRepository()
    const deleteUserSpy = jest.spyOn(prisma.user, 'delete')
    // act
    await sut.execute(userFixture.id)
    // assert
    expect(deleteUserSpy).toHaveBeenCalledWith({
      where: { id: userFixture.id },
    })
  })
})
