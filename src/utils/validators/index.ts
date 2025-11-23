import { Response } from 'express'
import validator from 'validator'
import { responseHelper } from '../../controllers/helpers'

export const validatorHelpers = {
  passwordIsValid: (password: string, res: Response) => {
    validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })

    return responseHelper.badRequest(
      res,
      'A senha deve ter pelo menos 6 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo.',
    )
  },
  emailIsValid: (email: string, res: Response) => {
    if (!validator.isEmail(email)) {
      return responseHelper.badRequest(
        res,
        'O email não é válido. Por favor, informe um email válido.',
      )
    }
  },
  idIsValid: (id: string, res: Response) => {
    if (!validator.isUUID(id)) {
      return responseHelper.badRequest(
        res,
        'O ID não é válido. Por favor, informe um ID válido.',
      )
    }
  },
  fieldsAreValid: (
    fields: string[],
    allowedFields: string[],
    res: Response,
  ) => {
    if (fields.some((field) => !allowedFields.includes(field))) {
      return responseHelper.badRequest(
        res,
        `Campos inválidos: ${fields
          .filter((field) => !allowedFields.includes(field))
          .join(', ')}`,
      )
    }
  },
}
