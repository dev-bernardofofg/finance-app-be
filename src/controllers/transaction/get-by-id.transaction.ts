import { Request, Response } from 'express'
import { ZodError } from 'zod'
import { transactionIdParamSchema } from '../../types'
import { IGetTransactionByIdUseCase } from '../../use-cases/transaction/get-by-id.transaction'
import { responseHelper } from '../helpers/http'

export class GetTransactionByIdController {
  private getTransactionByIdUseCase: IGetTransactionByIdUseCase
  constructor(getTransactionByIdUseCase: IGetTransactionByIdUseCase) {
    this.getTransactionByIdUseCase = getTransactionByIdUseCase
  }
  async execute(req: Request, res: Response) {
    try {
      const { id: transactionId } = await transactionIdParamSchema.parseAsync(
        req.params,
      )
      const transaction = await this.getTransactionByIdUseCase.execute({
        transactionId,
      })
      return responseHelper.ok(res, transaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof Error) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao buscar transação')
    }
  }
}
