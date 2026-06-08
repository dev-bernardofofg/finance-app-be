import { Request } from 'express'
import { ZodError } from 'zod'
import { UserNotFoundError } from '@/errors/user'
import {
  getTransactionsByUserIdParamsSchema,
  getTransactionsByUserIdQuerySchema,
} from '@/types'
import { IGetTransactionByUserIdUseCase } from '@/use-cases/transaction/get-by-user-id.transaction'
import { HttpResponse, responseHelper } from '@/controllers/helpers/http'

export class GetTransactionByUserIdController {
  private getTransactionByUserIdUseCase: IGetTransactionByUserIdUseCase
  constructor(getTransactionByUserIdUseCase: IGetTransactionByUserIdUseCase) {
    this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
  }
  async execute(req: Pick<Request, 'params' | 'query'>, res: HttpResponse) {
    try {
      const { user_id } = await getTransactionsByUserIdParamsSchema.parseAsync(
        req.params,
      )
      const { from_date, to_date } =
        await getTransactionsByUserIdQuerySchema.parseAsync(req.query)

      const transactions = await this.getTransactionByUserIdUseCase.execute({
        user_id,
        from_date,
        to_date,
      })

      if (!transactions) {
        return responseHelper.notFound(res, 'Transações não encontradas')
      }

      return responseHelper.ok(res, transactions)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(
        res,
        'Erro ao buscar transações',
      )
    }
  }
}
