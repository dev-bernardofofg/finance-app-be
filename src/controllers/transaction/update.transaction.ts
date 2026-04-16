import { Request } from 'express'
import { ZodError } from 'zod'
import { TransactionNotFoundError } from '../../errors/transaction'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../errors/user'
import {
  ITransactionParams,
  transactionIdParamSchema,
  updateTransactionSchema,
} from '../../types'
import { IUpdateTransactionUseCase } from '../../use-cases/transaction/update.transaction'
import { HttpResponse, responseHelper } from '../helpers/http'

export class UpdateTransactionController {
  private updateTransactionUseCase: IUpdateTransactionUseCase
  constructor(updateTransactionUseCase: IUpdateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }
  async execute(req: Pick<Request, 'params' | 'body'>, res: HttpResponse) {
    try {
      const { id: transactionId } = await transactionIdParamSchema.parseAsync(
        req.params,
      )
      const params = await updateTransactionSchema.parseAsync(req.body)
      const transaction = await this.updateTransactionUseCase.execute(
        transactionId,
        { ...params, date: params.date } as ITransactionParams,
      )

      if (!transaction) {
        return responseHelper.notFound(res, 'Transação não encontrada')
      }

      return responseHelper.ok(res, transaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof TransactionNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      if (error instanceof EmailAlreadyInUseError) {
        return responseHelper.badRequest(res, error.message)
      }
      return responseHelper.internalServerError(
        res,
        'Erro ao atualizar transação',
      )
    }
  }
}
