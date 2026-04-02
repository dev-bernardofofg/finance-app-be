import { faker } from '@faker-js/faker'
import { makeHttpResponse } from '../../helpers/test'
import { validatorHelpers } from './validator'

describe('validatorHelpers', () => {
  describe('emailIsValid', () => {
    it('should return null when email is valid', () => {
      const { response } = makeHttpResponse()
      const result = validatorHelpers.emailIsValid(
        faker.internet.email(),
        response,
      )
      expect(result).toBeNull()
    })

    it('should return 400 when email is invalid', () => {
      const { response } = makeHttpResponse()
      validatorHelpers.emailIsValid('invalid-email', response)
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.json).toHaveBeenCalledWith({
        message: 'O email não é válido. Por favor, informe um email válido.',
      })
    })
  })

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

  describe('fieldsAreValid', () => {
    it('should return undefined when all fields are valid', () => {
      const { response } = makeHttpResponse()
      const result = validatorHelpers.fieldsAreValid(
        ['name', 'email'],
        ['name', 'email'],
        response,
      )
      expect(result).toBeUndefined()
    })

    it('should return 400 when there are invalid fields', () => {
      const { response } = makeHttpResponse()
      validatorHelpers.fieldsAreValid(
        ['invalid_field'],
        ['name', 'email'],
        response,
      )
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.json).toHaveBeenCalledWith({
        message: 'Campos inválidos: invalid_field',
      })
    })
  })

  describe('fieldIsGreaterThanZero', () => {
    it('should return null when value is greater than zero', () => {
      const { response } = makeHttpResponse()
      const result = validatorHelpers.fieldIsGreaterThanZero(
        'amount',
        1,
        response,
      )
      expect(result).toBeNull()
    })

    it('should return 400 when value is zero', () => {
      const { response } = makeHttpResponse()
      validatorHelpers.fieldIsGreaterThanZero('amount', 0, response)
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.json).toHaveBeenCalledWith({
        message: 'O campo amount deve ser maior que 0',
      })
    })

    it('should return 400 when value is negative', () => {
      const { response } = makeHttpResponse()
      validatorHelpers.fieldIsGreaterThanZero('amount', -1, response)
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.json).toHaveBeenCalledWith({
        message: 'O campo amount deve ser maior que 0',
      })
    })
  })

  describe('fieldIsInEnum', () => {
    it('should return null when field is in enum', () => {
      const { response } = makeHttpResponse()
      const result = validatorHelpers.fieldIsInEnum(
        'EARNING',
        ['EARNING', 'EXPENSE'],
        response,
      )
      expect(result).toBeNull()
    })

    it('should return 400 when field is not in enum', () => {
      const { response } = makeHttpResponse()
      validatorHelpers.fieldIsInEnum(
        'INVALID',
        ['EARNING', 'EXPENSE'],
        response,
      )
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.json).toHaveBeenCalledWith({
        message:
          'O campo INVALID deve ser um dos seguintes valores: EARNING, EXPENSE',
      })
    })
  })

  describe('fieldIsCurrency', () => {
    it('should return null when value is a valid currency', () => {
      const { response } = makeHttpResponse()
      const result = validatorHelpers.fieldIsCurrency('amount', 10.5, response)
      expect(result).toBeNull()
    })

    it('should return 400 when value is not a number', () => {
      const { response } = makeHttpResponse()
      validatorHelpers.fieldIsCurrency(
        'amount',
        'not-a-number' as unknown as number,
        response,
      )
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.json).toHaveBeenCalledWith({
        message: 'O campo amount deve ser um número',
      })
    })

    it('should return 400 when value is a negative number', () => {
      const { response } = makeHttpResponse()
      validatorHelpers.fieldIsCurrency('amount', -10.5, response)
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.json).toHaveBeenCalledWith({
        message: 'O campo amount deve ser um valor monetário válido',
      })
    })
  })

  describe('validateRequiredFields', () => {
    it('should return null when all required fields are present', () => {
      const { response } = makeHttpResponse()
      const result = validatorHelpers.validateRequiredFields(
        { name: 'John', email: 'john@email.com' },
        ['name', 'email'],
        response,
      )
      expect(result).toBeNull()
    })

    it('should return 400 when a required field is missing', () => {
      const { response } = makeHttpResponse()
      validatorHelpers.validateRequiredFields(
        { name: 'John' },
        ['name', 'email'],
        response,
      )
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.json).toHaveBeenCalledWith({
        message: 'Campos obrigatórios: email',
      })
    })

    it('should return 400 when a required field is null', () => {
      const { response } = makeHttpResponse()
      validatorHelpers.validateRequiredFields(
        { name: 'John', email: null },
        ['name', 'email'],
        response,
      )
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.json).toHaveBeenCalledWith({
        message: 'Campos obrigatórios: email',
      })
    })
  })
})
