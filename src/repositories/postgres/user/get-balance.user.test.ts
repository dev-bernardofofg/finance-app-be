import { TransactionType } from '../../../../generated/prisma/enums'
import { prisma } from '../../../prisma/prisma'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresGetBalanceUserRepository } from './get-balance.user'

describe('PostgresGetBalanceUserRepository', () => {
  it('should get the balance of the user successfully', async () => {
    // arrange
    const sut = new PostgresGetBalanceUserRepository()
    // act
    const result = await sut.execute({ id: userFixture.id })
    // assert
    expect(result).toMatchObject({
      total_income: expect.any(Number),
      total_expenses: expect.any(Number),
      total_investments: expect.any(Number),
      balance: expect.any(Number),
    })
  })

  it('should call Prisma with correct parameters', async () => {
    // arrange
    const sut = new PostgresGetBalanceUserRepository()
    const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')
    // act
    await sut.execute({ id: userFixture.id })
    // assert
    expect(prismaSpy).toHaveBeenCalledTimes(3)
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { user_id: userFixture.id, type: TransactionType.INCOME },
      _sum: { amount: true },
    })
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { user_id: userFixture.id, type: TransactionType.EXPENSE },
      _sum: { amount: true },
    })
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { user_id: userFixture.id, type: TransactionType.INVESTMENT },
      _sum: { amount: true },
    })
  })
})
