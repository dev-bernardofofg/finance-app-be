import { Request } from 'express'
import { ZodError } from 'zod'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import { updateUserSchema } from '../../types'
import { IUpdateUserUseCase } from '../../use-cases/user'
import { HttpResponse, responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class UpdateUserController {
  private updateUserUseCase: IUpdateUserUseCase
  constructor(updateUserUseCase: IUpdateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase
  }
  async execute(req: Pick<Request, 'params' | 'body'>, res: HttpResponse) {
    try {
      const params = await updateUserSchema.parseAsync(req.body)
      const userId = req.params.id ?? ''

      if (!userId) {
        return responseHelper.badRequest(res, 'O ID do usuário é obrigatório')
      }

      const invalidIdResponse = validatorHelpers.idIsValid(userId, res)
      if (invalidIdResponse) return invalidIdResponse

      const updatedUser = await this.updateUserUseCase.execute(userId, params)

      return responseHelper.ok(res, updatedUser)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof EmailAlreadyInUseError) {
        return responseHelper.conflict(res, error.message)
      }
      return responseHelper.internalServerError(
        res,
        'Erro ao atualizar usuário',
      )
    }
  }
}
