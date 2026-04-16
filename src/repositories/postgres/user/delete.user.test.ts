import { Prisma } from '../../../../generated/prisma/client'
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
    expect(result).toEqual(expect.objectContaining(userFixture))
  })

  it('should call Prisma to correct parameters', async () => {
    // arrange
    await prisma.user.create({
      data: userFixture,
    })
    const sut = new PostgresDeleteUserRepository()
    const prismaSpy = jest.spyOn(prisma.user, 'delete')
    // act
    await sut.execute(userFixture.id)
    // assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: userFixture.id },
    })
  })

  it('should throw if Prisma throws', async () => {
    // arrange
    const sut = new PostgresDeleteUserRepository()
    jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute(userFixture.id)
    // assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw an error if the user is not found', async () => {
    // arrange
    const sut = new PostgresDeleteUserRepository()
    jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
      } as never),
    )
    // act
    const promise = sut.execute(userFixture.id)
    // assert
    await expect(promise).rejects.toThrow()
  })
})
