import { Request, Response } from 'express'
import { UserNotFoundError } from '../../errors/user'
import { GetBalanceUserParams } from '../../repositories/postgres'
import { IGetBalanceUserUseCase } from '../../use-cases/user'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class GetBalanceUserController {
  private getBalanceUserUseCase: IGetBalanceUserUseCase
  constructor(getBalanceUserUseCase: IGetBalanceUserUseCase) {
    this.getBalanceUserUseCase = getBalanceUserUseCase
  }

  async execute(req: Request, res: Response) {
    const params = req.params as Partial<GetBalanceUserParams>

    if (validatorHelpers.idIsValid(params.id ?? '', res)) return
    try {
      const balance = await this.getBalanceUserUseCase.execute(
        params as GetBalanceUserParams,
      )
      return responseHelper.ok(res, balance)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }

      return responseHelper.internalServerError(res, 'Erro ao buscar saldo')
    }
  }
}
