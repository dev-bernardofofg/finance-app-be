import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { Prisma } from '../../../../generated/prisma/client'
import { TransactionNotFoundError } from '../../../errors/transaction'
import { prisma } from '../../../prisma/prisma'
import { transactionFixture } from '../../../test/fixtures/transaction'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresUpdateTransactionRepository } from './update.transaction'

const updateTransactionParams = {
  name: faker.person.firstName(),
  type: faker.helpers.arrayElement(['INCOME', 'EXPENSE', 'INVESTMENT']),
  amount: faker.number.int({ min: 1, max: 100000 }),
  date: faker.date.recent().toISOString(),
}
describe('PostgresUpdateTransactionRepository', () => {
  it('should update a transaction successfully', async () => {
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
    const sut = new PostgresUpdateTransactionRepository()
    // act
    const result = await sut.execute(transactionFixture.id, {
      ...updateTransactionParams,
      user_id: userFixture.id,
    })
    if (!result) throw new Error('Transação não encontrada')
    // assert
    expect(result.id).toBe(transactionFixture.id)
    expect(result.user_id).toBe(userFixture.id)
    expect(result.name).toBe(updateTransactionParams.name)
    expect(result.type).toBe(updateTransactionParams.type)
    expect(result.amount).toBe(updateTransactionParams.amount)
    expect(dayjs(result.date).daysInMonth()).toBe(
      dayjs(updateTransactionParams.date).daysInMonth(),
    )
    expect(dayjs(result.date).year()).toBe(
      dayjs(updateTransactionParams.date).year(),
    )
    expect(dayjs(result.date).month()).toBe(
      dayjs(updateTransactionParams.date).month(),
    )
  })

  it('should call Prisma with correct parameters', async () => {
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
    const sut = new PostgresUpdateTransactionRepository()
    const prismaSpy = jest.spyOn(prisma.transaction, 'update')
    // act
    await sut.execute(transactionFixture.id, {
      ...updateTransactionParams,
      user_id: userFixture.id,
    })
    // assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: transactionFixture.id },
      data: {
        ...updateTransactionParams,
        user_id: userFixture.id,
      },
    })
  })

  it('should throw if Prisma throws', async () => {
    // arrange
    const sut = new PostgresUpdateTransactionRepository()
    jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute(transactionFixture.id, {
      ...updateTransactionParams,
      user_id: userFixture.id,
    })
    // assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw TransactionNotFoundError if the transaction is not found', async () => {
    // arrange
    const sut = new PostgresUpdateTransactionRepository()
    jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
      } as never),
    )
    // act
    const promise = sut.execute(transactionFixture.id, {
      ...updateTransactionParams,
      user_id: userFixture.id,
    })
    // assert
    await expect(promise).rejects.toThrow(
      new TransactionNotFoundError(transactionFixture.id),
    )
  })
})
