import { Request, Response } from 'express'
import { UserNotFoundError } from '../../errors/user.ts'
import { GetUserByEmailParams } from '../../repositories/postgres/index.ts'
import { IGetUserByEmailUseCase } from '../../use-cases/user'
import { responseHelper } from '../helpers/http.ts'
import { validatorHelpers } from '../helpers/validator.ts'

export class GetUserByEmailController {
  private getUserByEmailUseCase: IGetUserByEmailUseCase
  constructor(getUserByEmailUseCase: IGetUserByEmailUseCase) {
    this.getUserByEmailUseCase = getUserByEmailUseCase
  }

  async execute(req: Request, res: Response) {
    const params = req.query as Partial<GetUserByEmailParams>

    validatorHelpers.emailIsValid(params.email ?? '', res)

    try {
      const user = await this.getUserByEmailUseCase.execute(
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
  }
}
