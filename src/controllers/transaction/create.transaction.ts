import { Request } from 'express'
import { ZodError } from 'zod'
import { UserNotFoundError } from '@/errors/user'
import { createTransactionInputSchema } from '@/types'
import { ICreateTransactionUseCase } from '@/use-cases/transaction/create.transaction'
import { HttpResponse, responseHelper } from '@/controllers/helpers/http'

export class CreateTransactionController {
  private createTransactionUseCase: ICreateTransactionUseCase
  constructor(createTransactionUseCase: ICreateTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(req: Pick<Request, 'body' | 'params'>, res: HttpResponse) {
    try {
      const input = await createTransactionInputSchema.parseAsync(req.body)
      const user_id = req.params.user_id
      const transaction = await this.createTransactionUseCase.execute({
        ...input,
        user_id: user_id,
      })
      return responseHelper.created(res, transaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao criar transação')
    }
  }
}
