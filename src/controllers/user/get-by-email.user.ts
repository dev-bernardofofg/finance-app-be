import { Request } from 'express'
import { ZodError } from 'zod'
import { EmailUserNotFoundError } from '../../errors/user'
import { getEmailUserParamsSchema } from '../../types/index'
import { IGetUserByEmailUseCase } from '../../use-cases/user/index'
import { HttpResponse, responseHelper } from '../helpers/http'

export class GetUserByEmailController {
  private getUserByEmailUseCase: IGetUserByEmailUseCase
  constructor(getUserByEmailUseCase: IGetUserByEmailUseCase) {
    this.getUserByEmailUseCase = getUserByEmailUseCase
  }

  async execute(req: Pick<Request, 'query'>, res: HttpResponse) {
    const params = req.query as Partial<{ email: string }>

    try {
      const { email } = await getEmailUserParamsSchema.parseAsync(params)

      if (!email) {
        return responseHelper.badRequest(res, 'O email é obrigatório')
      }

      const user = await this.getUserByEmailUseCase.execute(email)
      return responseHelper.ok(res, user)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof EmailUserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao buscar usuário')
    }
  }
}
