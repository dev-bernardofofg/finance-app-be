import { Request } from 'express'
import { ZodError } from 'zod'
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

      if (!transaction) {
        return responseHelper.notFound(res, 'Transação não encontrada')
      }

      return responseHelper.ok(res, transaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(
          res,
          error.issues[0]?.message ?? 'Parâmetros inválidos',
        )
      }
      return responseHelper.internalServerError(
        res,
        'Erro ao deletar transação',
      )
    }
  }
}
