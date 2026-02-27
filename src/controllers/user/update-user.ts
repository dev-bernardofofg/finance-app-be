import { Request, Response } from 'express'
import { ZodError } from 'zod'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import { updateUserSchema } from '../../types/user.type'
import { IUpdateUserUseCase } from '../../use-cases/user'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class UpdateUserController {
  private updateUserUseCase: IUpdateUserUseCase
  constructor(updateUserUseCase: IUpdateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase
  }
  async execute(req: Request, res: Response) {
    try {
      const params = await updateUserSchema.parseAsync(req.body)
      const userId = req.params.id

      if (validatorHelpers.idIsValid(userId, res)) return

      const updatedUser = await this.updateUserUseCase.execute(userId, params)

      return responseHelper.ok(res, updatedUser)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
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
