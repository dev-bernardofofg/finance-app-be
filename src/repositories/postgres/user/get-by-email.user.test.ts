import { prisma } from '../../../prisma/prisma'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresGetUserByEmailRepository } from './get-by-email.user'

describe('PostgresGetUserByEmailRepository', () => {
  it('should get the user by email successfully', async () => {
    await prisma.user.create({
      data: userFixture,
    })
    // arrange
    const sut = new PostgresGetUserByEmailRepository()
    // act
    const result = await sut.execute(userFixture.email)
    // assert
    expect(result).toMatchObject(userFixture)
  })

  it('should call Prisma to correct parameters', async () => {
    // arrange
    const sut = new PostgresGetUserByEmailRepository()
    const prismaSpy = jest.spyOn(prisma.user, 'findUnique')
    // act
    await sut.execute(userFixture.email)
    // assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { email: userFixture.email },
    })
  })
})
