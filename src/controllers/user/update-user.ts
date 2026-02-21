import { Request, Response } from 'express'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import { UserFields } from '../../repositories/postgres'
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
      const params = req.body as UserFields
      const userId = req.params.id

      if (validatorHelpers.idIsValid(userId, res)) return

      const allowedFields: (keyof UserFields)[] = [
        'first_name',
        'last_name',
        'email',
        'password',
      ]

      if (
        validatorHelpers.fieldsAreValid(Object.keys(params), allowedFields, res)
      )
        return
      if (params.password) {
        if (validatorHelpers.passwordIsValid(params.password ?? '', res)) return
      }
      if (params.email) {
        if (validatorHelpers.emailIsValid(params.email ?? '', res)) return
      }

      const updatedUser = await this.updateUserUseCase.execute(userId, params)

      return responseHelper.ok(res, updatedUser)
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      if (error instanceof EmailAlreadyInUseError) {
        return responseHelper.badRequest(res, error.message)
      }
      return responseHelper.internalServerError(
        res,
        'Erro ao atualizar usuário',
      )
    }
  }
}
