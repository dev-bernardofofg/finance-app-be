import { Request, Response } from 'express'
import { IDeleteTransactionUseCase } from '../../use-cases/transaction/delete.transaction'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class DeleteTransactionController {
  private deleteTransactionUseCase: IDeleteTransactionUseCase
  constructor(deleteTransactionUseCase: IDeleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase
  }
  async execute(req: Request, res: Response) {
    const transactionId = req.params.id
    validatorHelpers.idIsValid(transactionId, res)
    try {
      const transaction =
        await this.deleteTransactionUseCase.execute(transactionId)
      return responseHelper.ok(res, transaction)
    } catch (error) {
      if (error instanceof Error) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(
        res,
        'Erro ao deletar transação',
      )
    }
  }
}
