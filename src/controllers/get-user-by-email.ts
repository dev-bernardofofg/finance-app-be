import { Request, Response } from 'express'
import validator from 'validator'
import { GetUserByEmailParams } from '../repositories/postgres/get-user-by-email'
import { GetUserByEmailUseCase } from '../use-cases/get-user-by-email.ts'
import { responseHelper } from './helpers'

export const GetUserByEmailController = {
  execute: async (req: Request, res: Response) => {
    const params = req.query as Partial<GetUserByEmailParams>
    const emailIsValid = validator.isEmail(params.email ?? '')
    if (!emailIsValid) {
      return responseHelper.badRequest(
        res,
        'O email não é válido. Por favor, informe um email válido.',
      )
    }
    try {
      const user = await GetUserByEmailUseCase.execute(
        params as GetUserByEmailParams,
      )
      return responseHelper.ok(res, user)
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      return responseHelper.internalServerError(res, 'Erro ao buscar usuário')
    }
  },
}
