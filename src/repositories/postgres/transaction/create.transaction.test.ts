import dayjs from 'dayjs'
import { transactionFixture } from '../../../test/fixtures/transaction'
import { PostgresCreateTransactionRepository } from './create.transaction'

describe('PostgresCreateTransactionRepository', () => {
  it('should create a transaction successfully', async () => {
    // arrange
    const sut = new PostgresCreateTransactionRepository()
    // act
    const result = await sut.execute(transactionFixture)
    // assert
    expect(result.id).toBe(transactionFixture.id)
    expect(result.user_id).toBe(transactionFixture.user_id)
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
