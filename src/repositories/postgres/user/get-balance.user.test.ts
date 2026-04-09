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
})
