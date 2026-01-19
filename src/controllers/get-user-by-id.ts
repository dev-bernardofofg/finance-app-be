import { Request, Response } from 'express'
import { UserNotFoundError } from '../errors/user'
import { GetUserByIdParams } from '../repositories/postgres/get-user-by-id'
import { IGetUserByIdUseCase } from '../use-cases/get-user-by-id'
import { responseHelper } from './helpers/http'
import { validatorHelpers } from './helpers/validator'

export class GetUserByIdController {
  private getUserByIdUseCase: IGetUserByIdUseCase
  constructor(getUserByIdUseCase: IGetUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }

  async execute(req: Request, res: Response) {
    const params = req.params as Partial<GetUserByIdParams>

    validatorHelpers.idIsValid(params.id ?? '', res)

    try {
      const user = await this.getUserByIdUseCase.execute(
        params as GetUserByIdParams,
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
