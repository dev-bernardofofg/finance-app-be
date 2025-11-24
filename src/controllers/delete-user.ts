import { Request, Response } from 'express'
import { UserNotFoundError } from '../errors/user'
import { DeleteUserUseCase } from '../use-cases/delete.user'
import { responseHelper } from './helpers/http'
import { validatorHelpers } from './helpers/validator'

export const DeleteUserController = {
  execute: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id

      validatorHelpers.idIsValid(userId, res)

      const user = await DeleteUserUseCase.execute(userId)
      console.log(user)

      if (user.length === 0) {
        return responseHelper.notFound(res, 'Usuário não encontrado')
      }

      return responseHelper.ok(res, user)
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao deletar usuário')
    }
  },
}
