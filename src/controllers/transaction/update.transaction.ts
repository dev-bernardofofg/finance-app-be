import { Request, Response } from 'express'
import { ZodError } from 'zod'
import {
  ITransactionParams,
  transactionIdParamSchema,
  updateTransactionSchema,
} from '../../types'
import { IUpdateTransactionUseCase } from '../../use-cases/transaction/update.transaction'
import { responseHelper } from '../helpers/http'

export class UpdateTransactionController {
  private updateTransactionUseCase: IUpdateTransactionUseCase
  constructor(updateTransactionUseCase: IUpdateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }
  async execute(req: Request, res: Response) {
    try {
      const { id: transactionId } = await transactionIdParamSchema.parseAsync(
        req.params,
      )
      const params = await updateTransactionSchema.parseAsync(req.body)
      const transaction = await this.updateTransactionUseCase.execute(
        transactionId,
        {
          ...params,
          date: new Date(params.date),
        } as ITransactionParams,
      )

      if (!transaction) {
        return responseHelper.notFound(res, 'Transação não encontrada')
      }

      return responseHelper.ok(res, transaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(
          res,
          error.issues[0]?.message ?? 'Dados da transação inválidos',
        )
      }
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
