import { Request, Response } from 'express'
import { UserNotFoundError } from '../../errors/user'
import { GetUserByIdParams } from '../../repositories/postgres'
import { IGetUserByIdUseCase } from '../../use-cases/user'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class GetUserByIdController {
  private getUserByIdUseCase: IGetUserByIdUseCase
  constructor(getUserByIdUseCase: IGetUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }

  async execute(req: Request, res: Response) {
    const params = req.params as Partial<GetUserByIdParams>

    if (validatorHelpers.idIsValid(params.id ?? '', res)) return

    try {
      const user = await this.getUserByIdUseCase.execute(
        params as GetUserByIdParams,
      )

      return responseHelper.ok(res, user)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao buscar usuário')
    }
  }
}
