import dayjs from 'dayjs'
import { prisma } from '../../../prisma/prisma'
import { transactionFixture } from '../../../test/fixtures/transaction'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresDeleteTransactionRepository } from './delete.transaction'

describe('PostgresDeleteTransactionRepository', () => {
  it('should delete a transaction successfully', async () => {
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
    const sut = new PostgresDeleteTransactionRepository()
    // act
    const result = await sut.execute(transactionFixture.id)
    if (!result) throw new Error('Resultado nulo inesperado')

    // assert
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
})
