import { Request, Response } from 'express'
import { UserNotFoundError } from '../errors/user'
import { GetUserByIdParams } from '../repositories/postgres/get-user-by-id'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id'
import { responseHelper } from './helpers/http'
import { validatorHelpers } from './helpers/validator'

export const GetUserByIdController = {
  execute: async (req: Request, res: Response) => {
    const params = req.params as Partial<GetUserByIdParams>

    validatorHelpers.idIsValid(params.id ?? '', res)

    try {
      const user = await GetUserByIdUseCase.execute(params as GetUserByIdParams)

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
