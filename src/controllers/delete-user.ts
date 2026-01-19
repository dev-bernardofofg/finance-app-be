import { Request, Response } from 'express'
import { UserNotFoundError } from '../errors/user'
import { IDeleteUserUseCase } from '../use-cases/delete.user'
import { responseHelper } from './helpers/http'
import { validatorHelpers } from './helpers/validator'

export class DeleteUserController {
  private deleteUserUseCase: IDeleteUserUseCase
  constructor(deleteUserUseCase: IDeleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }
  async execute(req: Request, res: Response) {
    try {
      const userId = req.params.id

      validatorHelpers.idIsValid(userId, res)

      const user = await this.deleteUserUseCase.execute(userId)
      console.log(user)

      if (!user) {
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
  }
}
