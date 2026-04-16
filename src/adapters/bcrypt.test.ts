import { faker } from '@faker-js/faker/.'
import { PasswordHasherAdapter } from './bcrypt'

describe('PasswordHasherAdapter', () => {
  it('should return a valid hashed password', async () => {
    // arrange
    const sut = new PasswordHasherAdapter()
    const password = faker.internet.password({ length: 6 })
    // act
    const result = await sut.execute(password)
    // assert
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
    expect(result).not.toBe(password)
  })
})
