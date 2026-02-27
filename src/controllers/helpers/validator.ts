import { Response } from 'express'
import validator from 'validator'
import { responseHelper } from './http'

export const validatorHelpers = {
  emailIsValid: (email: string, res: Response): Response | null => {
    if (!validator.isEmail(email)) {
      return responseHelper.badRequest(
        res,
        'O email não é válido. Por favor, informe um email válido.',
      )
    }

    return null
  },
  idIsValid: (id: string, res: Response): Response | null => {
    if (!validator.isUUID(id)) {
      return responseHelper.badRequest(
        res,
        'O ID não é válido. Por favor, informe um ID válido.',
      )
    }

    return null
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
  fieldIsGreaterThanZero: (
    fieldName: string,
    value: number,
    res: Response,
  ): Response | null => {
    if (value <= 0) {
      return responseHelper.badRequest(
        res,
        `O campo ${fieldName} deve ser maior que 0`,
      )
    }
    return null
  },
  fieldIsInEnum: (
    field: string,
    enumValues: string[],
    res: Response,
  ): Response | null => {
    if (!enumValues.includes(field)) {
      return responseHelper.badRequest(
        res,
        `O campo ${field} deve ser um dos seguintes valores: ${enumValues.join(', ')}`,
      )
    }
    return null
  },
  fieldIsCurrency: (
    fieldName: string,
    value: number,
    res: Response,
  ): Response | null => {
    if (typeof value !== 'number') {
      return responseHelper.badRequest(
        res,
        `O campo ${fieldName} deve ser um número`,
      )
    }
    if (
      !validator.isCurrency(value.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      })
    ) {
      return responseHelper.badRequest(
        res,
        `O campo ${fieldName} deve ser um valor monetário válido`,
      )
    }
    return null
  },
  validateRequiredFields: (
    params: Record<string, unknown>,
    requiredFields: string[],
    res: Response,
  ): Response | null => {
    const missingFields = requiredFields.filter(
      (field) => params[field] === undefined || params[field] === null,
    )
    if (missingFields.length > 0) {
      return responseHelper.badRequest(
        res,
        `Campos obrigatórios: ${missingFields.join(', ')}`,
      )
    }
    return null
  },
}
