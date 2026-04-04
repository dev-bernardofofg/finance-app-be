import { faker } from '@faker-js/faker'
import { makeHttpResponse } from '../../helpers/test'
import { validatorHelpers } from './validator'

describe('validatorHelpers', () => {
  describe('idIsValid', () => {
    it('should return null when id is valid', () => {
      const { response } = makeHttpResponse()
      const result = validatorHelpers.idIsValid(faker.string.uuid(), response)
      expect(result).toBeNull()
    })

    it('should return 400 when id is invalid', () => {
      const { response } = makeHttpResponse()
      validatorHelpers.idIsValid('invalid-id', response)
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.json).toHaveBeenCalledWith({
        message: 'O ID não é válido. Por favor, informe um ID válido.',
      })
    })
  })
})
