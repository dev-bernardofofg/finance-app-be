import { prisma } from '../../../prisma/prisma'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresUpdateUserRepository } from './update.user'

describe('PostgresUpdateUserRepository', () => {
  it('should update a user successfully', async () => {
    // arrange
    await prisma.user.create({
      data: userFixture,
    })
    const sut = new PostgresUpdateUserRepository()
    // act
    const result = await sut.execute(userFixture.id, userFixture)
    // assert
    expect(result).toEqual(expect.objectContaining(userFixture))
  })

  it('should call Prisma to correct parameters', async () => {
    // arrange
    await prisma.user.create({
      data: userFixture,
    })
    const sut = new PostgresUpdateUserRepository()
    const prismaSpy = jest.spyOn(prisma.user, 'update')
    // act
    await sut.execute(userFixture.id, userFixture)
    // assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: userFixture.id },
      data: userFixture,
    })
  })
})
