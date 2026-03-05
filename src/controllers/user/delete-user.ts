import { Request, Response } from 'express'
import { UserNotFoundError } from '../../errors/user'
import { IDeleteUserUseCase } from '../../use-cases/user'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class DeleteUserController {
  private deleteUserUseCase: IDeleteUserUseCase
  constructor(deleteUserUseCase: IDeleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }
  async execute(req: Request, res: Response) {
    try {
      const userId = req.params.id

      if (validatorHelpers.idIsValid(userId, res)) return

      const user = await this.deleteUserUseCase.execute(userId)

      return responseHelper.ok(res, user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao deletar usuário')
    }
  }
}
