import { Request } from 'express'
import { ZodError } from 'zod'
import { TransactionNotFoundError } from '../../errors/transaction'
import { transactionIdParamSchema } from '../../types'
import { IGetTransactionByIdUseCase } from '../../use-cases/transaction/get-by-id.transaction'
import { HttpResponse, responseHelper } from '../helpers/http'

export class GetTransactionByIdController {
  private getTransactionByIdUseCase: IGetTransactionByIdUseCase
  constructor(getTransactionByIdUseCase: IGetTransactionByIdUseCase) {
    this.getTransactionByIdUseCase = getTransactionByIdUseCase
  }
  async execute(req: Pick<Request, 'params'>, res: HttpResponse) {
    try {
      const { id: transactionId } = await transactionIdParamSchema.parseAsync(
        req.params,
      )
      const transaction =
        await this.getTransactionByIdUseCase.execute(transactionId)
      return responseHelper.ok(res, transaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof TransactionNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao buscar transação')
    }
  }
}
