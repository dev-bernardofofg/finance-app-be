import { prisma } from '../../../prisma/prisma'
import { transactionFixture } from '../../../test/fixtures/transaction'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresGetTransactionsRepository } from './get-all.transactions'

describe('PostgresGetTransactionsRepository', () => {
  it('should get all transactions successfully', async () => {
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
    const sut = new PostgresGetTransactionsRepository()
    // act
    const result = await sut.execute({ user_id: userFixture.id })
    // assert
    expect(result).toHaveLength(1)
  })

  it('should call Prisma with correct parameters', async () => {
    // arrange
    const sut = new PostgresGetTransactionsRepository()
    const prismaSpy = jest.spyOn(prisma.transaction, 'findMany')
    // act
    await sut.execute({ user_id: userFixture.id })
    // assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { user_id: userFixture.id },
    })
  })

  it('should throw if Prisma throws', async () => {
    // arrange
    const sut = new PostgresGetTransactionsRepository()
    jest
      .spyOn(prisma.transaction, 'findMany')
      .mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute({ user_id: userFixture.id })
    // assert
    await expect(promise).rejects.toThrow()
  })
})
