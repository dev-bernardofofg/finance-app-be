import { Request } from 'express'
import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user'
import { createTransactionSchema, ITransactionParams } from '../../types'
import { ICreateTransactionUseCase } from '../../use-cases/transaction/create.transaction'
import { HttpResponse, responseHelper } from '../helpers/http'

export class CreateTransactionController {
  private createTransactionUseCase: ICreateTransactionUseCase
  constructor(createTransactionUseCase: ICreateTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(req: Request, res: HttpResponse) {
    try {
      const params = await createTransactionSchema.parseAsync(req.body)
      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        date: new Date(params.date),
      } as ITransactionParams)
      return responseHelper.created(res, transaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(
          res,
          error.issues[0]?.message ?? 'Dados da transação inválidos',
        )
      }
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao criar transação')
    }
  }
}
