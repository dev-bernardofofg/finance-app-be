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
    const expectedDate = transactionFixture.date.split('T')[0]
    const receivedDate = new Date(result[0].date).toISOString().split('T')[0]
    expect(receivedDate).toBe(expectedDate)
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
})
