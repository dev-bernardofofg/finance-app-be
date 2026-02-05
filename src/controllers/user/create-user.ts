import { Request, Response } from 'express'
import { EmailAlreadyInUseError } from '../../errors/user'
import { ICreateUserParams } from '../../types/user.type'
import { ICreateUserUseCase } from '../../use-cases'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class CreateUserController {
  private createUserUseCase: ICreateUserUseCase
  constructor(createUserUseCase: ICreateUserUseCase) {
    this.createUserUseCase = createUserUseCase
  }

  async execute(req: Request, res: Response) {
    const params = req.body as Partial<ICreateUserParams>
    const requiredFields: (keyof ICreateUserParams)[] = [
      'first_name',
      'last_name',
      'email',
      'password',
    ]
    validatorHelpers.emailIsValid(params.email ?? '', res)
    validatorHelpers.passwordIsValid(params.password ?? '', res)

    for (const field of requiredFields) {
      if (!params?.[field] || String(params[field]).trim().length === 0) {
        return responseHelper.badRequest(res, `O campo ${field} é obrigatório`)
      }
    }

    try {
      const user = await this.createUserUseCase.execute(
        params as ICreateUserParams,
      )
      return responseHelper.created(res, user)
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return responseHelper.badRequest(res, error.message)
      }

      return responseHelper.internalServerError(res, 'Erro ao criar usuário')
    }
  }
}
