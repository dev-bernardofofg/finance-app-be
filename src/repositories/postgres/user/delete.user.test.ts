import { prisma } from '../../../../prisma/prisma'
import { userFixture } from '../../../test/fixtures/user'
import { PostgresDeleteUserRepository } from './delete.user'

describe('PostgresDeleteUserRepository', () => {
  beforeEach(async () => {
    await prisma.user.create({
      data: userFixture,
    })
  })

  it('should delete a user successfully', async () => {
    // arrange
    const sut = new PostgresDeleteUserRepository()
    // act
    const result = await sut.execute(userFixture.id)
    // assert
    expect(result).toMatchObject(userFixture)
  })
})
