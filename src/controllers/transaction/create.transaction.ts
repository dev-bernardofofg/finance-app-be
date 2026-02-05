import { Request, Response } from 'express'
import { UserNotFoundError } from '../../errors/user'
import { ITransactionParams } from '../../types/transaction.type'
import { ICreateTransactionUseCase } from '../../use-cases/transaction/create.transaction'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class CreateTransactionController {
  private createTransactionUseCase: ICreateTransactionUseCase
  constructor(createTransactionUseCase: ICreateTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(req: Request, res: Response) {
    const params = req.body
    const requiredFields: (keyof ITransactionParams)[] = [
      'user_id',
      'name',
      'type',
      'amount',
      'date',
    ]

    validatorHelpers.fieldsAreValid(Object.keys(params), requiredFields, res)
    validatorHelpers.fieldIsGreaterThanZero(params.amount, res)
    validatorHelpers.fieldIsInEnum(
      params.type,
      ['income', 'expense', 'investment'],
      res,
    )

    for (const field of requiredFields) {
      if (
        !params?.[field] ||
        (typeof params[field] === 'number' && params[field] <= 0)
      ) {
        return responseHelper.badRequest(res, `O campo ${field} é obrigatório`)
      }
    }

    try {
      const transaction = await this.createTransactionUseCase.execute(
        params as ITransactionParams,
      )
      return responseHelper.created(res, transaction)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      console.error('Erro ao criar transação:', error)
      return responseHelper.internalServerError(res, 'Erro ao criar transação')
    }
  }
}
