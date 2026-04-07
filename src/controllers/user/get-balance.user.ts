import { Request } from 'express'
import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user'
import { GetUserByIdParams } from '../../repositories/postgres'
import { getUserIdParamsSchema } from '../../types'
import { IGetBalanceUserUseCase } from '../../use-cases/user'
import { HttpResponse, responseHelper } from '../helpers/http'

export class GetBalanceUserController {
  private getBalanceUserUseCase: IGetBalanceUserUseCase
  constructor(getBalanceUserUseCase: IGetBalanceUserUseCase) {
    this.getBalanceUserUseCase = getBalanceUserUseCase
  }

  async execute(req: Pick<Request, 'params'>, res: HttpResponse) {
    try {
      const params = req.params as Partial<GetUserByIdParams>
      const { id } = await getUserIdParamsSchema.parseAsync(params)

      const balance = await this.getBalanceUserUseCase.execute(id)

      if (!balance) {
        return responseHelper.notFound(res, 'Saldo não encontrado')
      }

      return responseHelper.ok(res, balance)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }

      return responseHelper.internalServerError(res, 'Erro ao buscar saldo')
    }
  }
}
