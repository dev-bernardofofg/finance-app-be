import { prisma } from '@/prisma/prisma'
import { userFixture } from '@/test/fixtures/user'
import { PostgresGetUserByEmailRepository } from './get-by-email.user'
import { Prisma } from '../../../../generated/prisma/client'
import { EmailUserNotFoundError } from '@/errors/user'

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

  it('should throw EmailUserNotFoundError if the user is not found', async () => {
    // arrange
    const sut = new PostgresGetUserByEmailRepository()
    jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
      } as never),
    )
    // act
    const promise = sut.execute(userFixture.email)
    // assert
    await expect(promise).rejects.toThrow(
      new EmailUserNotFoundError(userFixture.email),
    )
  })
  it('should throw generic error if Prisma throws', async () => {
    // arrange
    const sut = new PostgresGetUserByEmailRepository()
    jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute(userFixture.email)
    // assert
    await expect(promise).rejects.toThrow()
  })
})
