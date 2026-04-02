import { Request } from 'express'
import { UserNotFoundError } from '../../errors/user'
import { getBalanceUserParamsSchema } from '../../types'
import { IGetBalanceUserUseCase } from '../../use-cases/user'
import { HttpResponse, responseHelper } from '../helpers/http'

export class GetBalanceUserController {
  private getBalanceUserUseCase: IGetBalanceUserUseCase
  constructor(getBalanceUserUseCase: IGetBalanceUserUseCase) {
    this.getBalanceUserUseCase = getBalanceUserUseCase
  }

  async execute(req: Pick<Request, 'params'>, res: HttpResponse) {
    const { id } = await getBalanceUserParamsSchema.parseAsync(req.params)

    try {
      const balance = await this.getBalanceUserUseCase.execute(id)

      if (!balance) {
        return responseHelper.notFound(res, 'Saldo não encontrado')
      }

      return responseHelper.ok(res, balance)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }

      return responseHelper.internalServerError(res, 'Erro ao buscar saldo')
    }
  }
}
