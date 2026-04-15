import { prisma } from '../../../prisma/prisma'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresGetUserByIdRepository } from './get-by-id.user'

describe('PostgresGetUserByIdRepository', () => {
  it('should get the user by id successfully', async () => {
    // arrange
    await prisma.user.create({
      data: userFixture,
    })
    const sut = new PostgresGetUserByIdRepository()
    // act
    const result = await sut.execute({ id: userFixture.id })
    // assert
    expect(result).toMatchObject(userFixture)
  })

  it('should call Prisma to correct parameters', async () => {
    // arrange
    const sut = new PostgresGetUserByIdRepository()
    const prismaSpy = jest.spyOn(prisma.user, 'findUnique')
    // act
    await sut.execute({ id: userFixture.id })
    // assert
    expect(prismaSpy).toHaveBeenCalledWith({ where: { id: userFixture.id } })
  })
})
