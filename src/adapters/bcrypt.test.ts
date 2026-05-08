import { faker } from '@faker-js/faker'
import { PasswordComparerAdapter, PasswordHasherAdapter } from './bcrypt'

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

describe('PasswordComparerAdapter', () => {
  it('should return true if the password is valid', async () => {
    // arrange
    const hasher = new PasswordHasherAdapter()
    const sut = new PasswordComparerAdapter()
    const password = faker.internet.password({ length: 6 })
    // act
    const hashedPassword = await hasher.execute(password)
    const result = await sut.execute(password, hashedPassword)
    // assert
    expect(result).toBe(true)
  })

  it('should return false if the password is invalid', async () => {
    // arrange
    const hasher = new PasswordHasherAdapter()
    const sut = new PasswordComparerAdapter()
    const password = faker.internet.password({ length: 6 })
    const invalidPassword = faker.internet.password({ length: 6 })
    // act
    const hashedPassword = await hasher.execute(password)
    const isPasswordValid = await sut.execute(invalidPassword, hashedPassword)
    // assert
    expect(isPasswordValid).toBe(false)
  })
})
