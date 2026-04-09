import { prisma } from '../../../../prisma/prisma'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresCreateUserRepository } from './create.user'

describe('PostgresCreateUserRepository', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create a user successfully', async () => {
    // arrange
    const sut = new PostgresCreateUserRepository()
    // act
    const result = await sut.execute(userFixture)
    // assert
    expect(result).toMatchObject(userFixture)
  })
})
