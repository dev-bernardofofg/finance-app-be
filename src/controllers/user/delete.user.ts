import { Request } from 'express'
import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user'
import { IDeleteUserUseCase } from '../../use-cases/user'
import { HttpResponse, responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class DeleteUserController {
  private deleteUserUseCase: IDeleteUserUseCase
  constructor(deleteUserUseCase: IDeleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }
  async execute(req: Pick<Request, 'params'>, res: HttpResponse) {
    try {
      const userId = req.params.id

      const invalidIdResponse = validatorHelpers.idIsValid(userId, res)
      if (invalidIdResponse) return invalidIdResponse

      const user = await this.deleteUserUseCase.execute(userId)

      return responseHelper.ok(res, user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      return responseHelper.internalServerError(res, 'Erro ao deletar usuário')
    }
  }
}
