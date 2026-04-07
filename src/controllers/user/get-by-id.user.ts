import { Request } from 'express'
import { ZodError } from 'zod'
import { UserNotFoundError } from '../../errors/user'
import { GetUserByIdParams } from '../../repositories/postgres'
import { getUserIdParamsSchema } from '../../types'
import { IGetUserByIdUseCase } from '../../use-cases/user'
import { HttpResponse, responseHelper } from '../helpers/http'

export class GetUserByIdController {
  private getUserByIdUseCase: IGetUserByIdUseCase
  constructor(getUserByIdUseCase: IGetUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }

  async execute(req: Pick<Request, 'params'>, res: HttpResponse) {
    try {
      const params = req.params as Partial<GetUserByIdParams>
      const { id } = await getUserIdParamsSchema.parseAsync(params)

      const user = await this.getUserByIdUseCase.execute(id)

      return responseHelper.ok(res, user)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof UserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao buscar usuário')
    }
  }
}
