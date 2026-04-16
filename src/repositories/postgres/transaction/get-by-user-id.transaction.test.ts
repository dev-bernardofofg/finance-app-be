import dayjs from 'dayjs'
import { Prisma } from '../../../../generated/prisma/client'
import { UserNotFoundError } from '../../../errors/user'
import { prisma } from '../../../prisma/prisma'
import { transactionFixture } from '../../../test/fixtures/transaction'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresGetTransactionByUserIdRepository } from './get-by-user-id.transaction'

describe('PostgresGetTransactionByUserIdRepository', () => {
  it('should get a transaction by user id successfully', async () => {
    // arrange
    await prisma.user.create({
      data: userFixture,
    })
    await prisma.transaction.create({
      data: {
        ...transactionFixture,
        user_id: userFixture.id,
      },
    })
    const sut = new PostgresGetTransactionByUserIdRepository()
    // act
    const result = await sut.execute(userFixture.id)
    // assert
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(transactionFixture.id)
    expect(result[0].user_id).toBe(userFixture.id)
    expect(result[0].name).toBe(transactionFixture.name)
    expect(result[0].type).toBe(transactionFixture.type)
    expect(result[0].amount).toBe(transactionFixture.amount)
    expect(dayjs(result[0].date).daysInMonth()).toBe(
      dayjs(transactionFixture.date).daysInMonth(),
    )
    expect(dayjs(result[0].date).year()).toBe(
      dayjs(transactionFixture.date).year(),
    )
    expect(dayjs(result[0].date).month()).toBe(
      dayjs(transactionFixture.date).month(),
    )
  })

  it('should call Prisma with correct parameters', async () => {
    // arrange
    const sut = new PostgresGetTransactionByUserIdRepository()
    const prismaSpy = jest.spyOn(prisma.transaction, 'findMany')
    // act
    await sut.execute(userFixture.id)
    // assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { user_id: userFixture.id },
    })
  })

  it('should throw if Prisma throws', async () => {
    // arrange
    const sut = new PostgresGetTransactionByUserIdRepository()
    jest
      .spyOn(prisma.transaction, 'findMany')
      .mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute(userFixture.id)
    // assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw UserNotFoundError if the user is not found', async () => {
    // arrange
    const sut = new PostgresGetTransactionByUserIdRepository()
    jest.spyOn(prisma.transaction, 'findMany').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
      } as never),
    )
    // act
    const promise = sut.execute(userFixture.id)
    // assert
    await expect(promise).rejects.toThrow(UserNotFoundError)
  })
})
