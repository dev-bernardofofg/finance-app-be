import { Request, Response } from 'express'
import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user'
import { getTransactionsByUserIdQuerySchema } from '../../types'
import { IGetTransactionByUserIdUseCase } from '../../use-cases/transaction/get-by-user-id.transaction'
import { responseHelper } from '../helpers/http'

export class GetTransactionByUserIdController {
  private getTransactionByUserIdUseCase: IGetTransactionByUserIdUseCase
  constructor(getTransactionByUserIdUseCase: IGetTransactionByUserIdUseCase) {
    this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
  }
  async execute(req: Request, res: Response) {
    try {
      const { userId } = await getTransactionsByUserIdQuerySchema.parseAsync(
        req.query,
      )

      const transactions = await this.getTransactionByUserIdUseCase.execute({
        userId,
      })
      return responseHelper.ok(res, transactions)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(
          res,
          error.issues[0]?.message ?? 'Dados da transação inválidos',
        )
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
