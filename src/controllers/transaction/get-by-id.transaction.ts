import { Request, Response } from 'express'
import { IGetTransactionByIdUseCase } from '../../use-cases/transaction/get-by-id.transaction'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'

export class GetTransactionByIdController {
  private getTransactionByIdUseCase: IGetTransactionByIdUseCase
  constructor(getTransactionByIdUseCase: IGetTransactionByIdUseCase) {
    this.getTransactionByIdUseCase = getTransactionByIdUseCase
  }
  async execute(req: Request, res: Response) {
    const transactionId = req.params.id
    validatorHelpers.idIsValid(transactionId, res)
    try {
      const transaction = await this.getTransactionByIdUseCase.execute({
        transactionId,
      })
      return responseHelper.ok(res, transaction)
    } catch (error) {
      if (error instanceof Error) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao buscar transação')
    }
  }
}
