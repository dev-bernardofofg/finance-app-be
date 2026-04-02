import { Request } from 'express'
import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user'
import { getTransactionsByUserIdQuerySchema } from '../../types'
import { IGetTransactionByUserIdUseCase } from '../../use-cases/transaction/get-by-user-id.transaction'
import { HttpResponse, responseHelper } from '../helpers/http'

export class GetTransactionByUserIdController {
  private getTransactionByUserIdUseCase: IGetTransactionByUserIdUseCase
  constructor(getTransactionByUserIdUseCase: IGetTransactionByUserIdUseCase) {
    this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
  }
  async execute(req: Pick<Request, 'query'>, res: HttpResponse) {
    try {
      const { userId } = await getTransactionsByUserIdQuerySchema.parseAsync(
        req.query,
      )

      const transactions = await this.getTransactionByUserIdUseCase.execute({
        userId,
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
