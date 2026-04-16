import { TransactionNotFoundError } from '../../../errors/transaction'
import { prisma } from '../../../prisma/prisma'
import { transactionFixture } from '../../../test/fixtures/transaction'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresGetTransactionByIdRepository } from './get-by-id.transaction'

describe('PostgresGetTransactionByIdRepository', () => {
  it('should get a transaction by id successfully', async () => {
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
    const sut = new PostgresGetTransactionByIdRepository()
    // act
    const result = await sut.execute({ transactionId: transactionFixture.id })
    if (!result) throw new Error('Resultado nulo inesperado')

    // assert
    expect(result.id).toBe(transactionFixture.id)
    expect(result.user_id).toBe(userFixture.id)
    expect(result.name).toBe(transactionFixture.name)
    expect(result.type).toBe(transactionFixture.type)
    expect(result.amount).toBe(transactionFixture.amount)
    const expectedDate = transactionFixture.date.split('T')[0]
    const receivedDate = new Date(result.date).toISOString().split('T')[0]
    expect(receivedDate).toBe(expectedDate)
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
    const sut = new PostgresGetTransactionByIdRepository()
    const prismaSpy = jest.spyOn(prisma.transaction, 'findUnique')
    // act
    await sut.execute({ transactionId: transactionFixture.id })
    // assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: transactionFixture.id },
    })
  })

  it('should throw if Prisma throws', async () => {
    // arrange
    const sut = new PostgresGetTransactionByIdRepository()
    jest
      .spyOn(prisma.transaction, 'findUnique')
      .mockRejectedValueOnce(new Error())
    // act
    const promise = sut.execute({ transactionId: transactionFixture.id })
    // assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw an error if the transaction is not found', async () => {
    // arrange
    const sut = new PostgresGetTransactionByIdRepository()
    jest
      .spyOn(prisma.transaction, 'findUnique')
      .mockRejectedValueOnce(
        new TransactionNotFoundError(transactionFixture.id),
      )
    // act
    const promise = sut.execute({ transactionId: transactionFixture.id })
    // assert
    await expect(promise).rejects.toThrow()
  })
})
