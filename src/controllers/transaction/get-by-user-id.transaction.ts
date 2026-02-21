import { Request, Response } from 'express'
import { UserNotFoundError } from '../../errors/user'
import { IGetTransactionByUserIdUseCase } from '../../use-cases/transaction/get-by-user-id.transaction'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class GetTransactionByUserIdController {
  private getTransactionByUserIdUseCase: IGetTransactionByUserIdUseCase
  constructor(getTransactionByUserIdUseCase: IGetTransactionByUserIdUseCase) {
    this.getTransactionByUserIdUseCase = getTransactionByUserIdUseCase
  }
  async execute(req: Request, res: Response) {
    try {
      const userId = req.query.userId as string
      if (!userId) {
        return responseHelper.badRequest(res, 'O campo userId é obrigatório')
      }
      if (validatorHelpers.idIsValid(userId, res)) return

      const transactions = await this.getTransactionByUserIdUseCase.execute({
        userId,
      })
      return responseHelper.ok(res, transactions)
    } catch (error) {
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
