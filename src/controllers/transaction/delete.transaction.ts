import { Request } from 'express'
import { ZodError } from 'zod'
import { TransactionNotFoundError } from '../../errors/transaction'
import { transactionIdParamSchema } from '../../types'
import { IDeleteTransactionUseCase } from '../../use-cases/transaction/delete.transaction'
import { HttpResponse, responseHelper } from '../helpers/http'

export class DeleteTransactionController {
  private deleteTransactionUseCase: IDeleteTransactionUseCase
  constructor(deleteTransactionUseCase: IDeleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase
  }
  async execute(req: Pick<Request, 'params'>, res: HttpResponse) {
    try {
      const { id: transactionId } = await transactionIdParamSchema.parseAsync(
        req.params,
      )
      const transaction =
        await this.deleteTransactionUseCase.execute(transactionId)

      return responseHelper.ok(res, transaction)
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      return responseHelper.internalServerError(
        res,
        'Erro ao deletar transação',
      )
    }
  }
}
