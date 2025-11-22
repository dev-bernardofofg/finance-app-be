import { Request, Response } from 'express'
import validator from 'validator'
import { GetUserByIdParams } from '../repositories/postgres/get-user-by-id'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id'
import { responseHelper } from './helpers'

export const GetUserByIdController = {
  execute: async (req: Request, res: Response) => {
    const params = req.params as Partial<GetUserByIdParams>
    const idIsValid = validator.isUUID(params.id ?? '')
    if (!idIsValid) {
      return responseHelper.badRequest(
        res,
        'O ID não é válido. Por favor, informe um ID válido.',
      )
    }
    try {
      const user = await GetUserByIdUseCase.execute(params as GetUserByIdParams)
      return responseHelper.ok(res, user)
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return responseHelper.internalServerError(res, 'Erro ao buscar usuário')
    }
  },
}
