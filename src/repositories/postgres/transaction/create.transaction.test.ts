import dayjs from 'dayjs'
import { prisma } from '../../../prisma/prisma'
import { transactionFixture } from '../../../test/fixtures/transaction'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresCreateTransactionRepository } from './create.transaction'

describe('PostgresCreateTransactionRepository', () => {
  it('should create a transaction successfully', async () => {
    // arrange
    await prisma.user.create({
      data: userFixture,
    })
    const sut = new PostgresCreateTransactionRepository()
    // act
    const result = await sut.execute({
      ...transactionFixture,
      user_id: userFixture.id,
    })
    // assert
    expect(result.id).toBe(transactionFixture.id)
    expect(result.user_id).toBe(userFixture.id)
    expect(result.name).toBe(transactionFixture.name)
    expect(result.type).toBe(transactionFixture.type)
    expect(result.amount).toBe(transactionFixture.amount)
    expect(dayjs(result.date).daysInMonth()).toBe(
      dayjs(transactionFixture.date).daysInMonth(),
    )
    expect(dayjs(result.date).year()).toBe(
      dayjs(transactionFixture.date).year(),
    )
    expect(dayjs(result.date).month()).toBe(
      dayjs(transactionFixture.date).month(),
    )
  })

  it('should call Prisma with correct parameters', async () => {
    // arrange
    await prisma.user.create({
      data: userFixture,
    })
    const sut = new PostgresCreateTransactionRepository()
    const prismaSpy = jest.spyOn(prisma.transaction, 'create')
    // act
    await sut.execute({
      ...transactionFixture,
      user_id: userFixture.id,
    })
    // assert
    expect(prismaSpy).toHaveBeenCalledWith({
      data: {
        ...transactionFixture,
        user_id: userFixture.id,
      },
    })
  })

  it('should throw if Prisma throws', async () => {
    // arrange
    const sut = new PostgresCreateTransactionRepository()
    jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute({
      ...transactionFixture,
      user_id: userFixture.id,
    })
    // assert
    await expect(promise).rejects.toThrow()
  })
})
