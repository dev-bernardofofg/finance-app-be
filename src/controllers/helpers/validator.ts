import isUUID from 'validator/lib/isUUID.js'
import { HttpResponse, responseHelper } from './http'

export const validatorHelpers = {
  idIsValid: (id: string, res: HttpResponse): HttpResponse | null => {
    if (!isUUID(id)) {
      return responseHelper.badRequest(
        res,
        'O ID não é válido. Por favor, informe um ID válido.',
      )
    }

    return null
  },
}
