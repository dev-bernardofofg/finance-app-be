import { Request, Response } from 'express'
import { UserNotFoundError } from '../errors/user'
import { GetUserByEmailParams } from '../repositories/postgres/get-user-by-email'
import { GetUserByEmailUseCase } from '../use-cases/get-user-by-email.ts'
import { responseHelper } from './helpers/http.ts'
import { validatorHelpers } from './helpers/validator.ts'

export const GetUserByEmailController = {
  execute: async (req: Request, res: Response) => {
    const params = req.query as Partial<GetUserByEmailParams>

    validatorHelpers.emailIsValid(params.email ?? '', res)

    try {
      const user = await GetUserByEmailUseCase.execute(
        params as GetUserByEmailParams,
      )
      return responseHelper.ok(res, user)
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao buscar usuário')
    }
  },
}
