import { Request } from 'express'
import { ZodError } from 'zod'
import { UserNotFoundError } from '@/errors/user'
import { GetUserByIdParams } from '@/repositories/postgres'
import { getBalanceUserQuerySchema, getUserIdParamsSchema } from '@/types'
import { IGetBalanceUserUseCase } from '@/use-cases/user'
import { HttpResponse, responseHelper } from '@/controllers/helpers/http'

export class GetBalanceUserController {
  private getBalanceUserUseCase: IGetBalanceUserUseCase
  constructor(getBalanceUserUseCase: IGetBalanceUserUseCase) {
    this.getBalanceUserUseCase = getBalanceUserUseCase
  }

  async execute(req: Pick<Request, 'params' | 'query'>, res: HttpResponse) {
    try {
      const params = req.params as Partial<GetUserByIdParams>
      const { id } = await getUserIdParamsSchema.parseAsync(params)
      const { from_date, to_date } = await getBalanceUserQuerySchema.parseAsync(
        req.query,
      )

      const balance = await this.getBalanceUserUseCase.execute({
        id,
        from_date,
        to_date,
      })

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
