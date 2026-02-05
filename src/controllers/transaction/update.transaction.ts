import { Request, Response } from 'express'
import { ITransactionParams } from '../../types/transaction.type'
import { IUpdateTransactionUseCase } from '../../use-cases/transaction/update.transaction'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class UpdateTransactionController {
  private updateTransactionUseCase: IUpdateTransactionUseCase
  constructor(updateTransactionUseCase: IUpdateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }
  async execute(req: Request, res: Response) {
    const transactionId = req.params.id
    validatorHelpers.idIsValid(transactionId, res)
    const params = req.body
    const requiredFields: (keyof ITransactionParams)[] = [
      'user_id',
      'name',
      'type',
      'amount',
      'date',
    ]
    validatorHelpers.fieldsAreValid(Object.keys(params), requiredFields, res)

    for (const field of requiredFields) {
      if (
        !params?.[field] ||
        (typeof params[field] === 'number' && params[field] <= 0)
      ) {
        return responseHelper.badRequest(res, `O campo ${field} é obrigatório`)
      }
    }

    try {
      const transaction = await this.updateTransactionUseCase.execute(
        transactionId,
        params as ITransactionParams,
      )
      return responseHelper.ok(res, transaction)
    } catch (error) {
      if (error instanceof Error) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(
        res,
        'Erro ao atualizar transação',
      )
    }
  }
}
