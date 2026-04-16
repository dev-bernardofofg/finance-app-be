import { IdGeneratorAdapter } from './id-generator'

describe('IdGeneratorAdapter', () => {
  it('should return a valid UUID', async () => {
    // arrange
    const sut = new IdGeneratorAdapter()
    // act
    const result = await sut.execute()
    // assert
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i
    expect(uuidRegex.test(result)).toBe(true)
  })
})
