import { Request } from 'express'
import { ILoginUserUseCase } from '@/use-cases/user'
import { HttpResponse, responseHelper } from '@/controllers/helpers/http'
import { ZodError } from 'zod'
import { EmailUserNotFoundError, InvalidCredentialsError } from '@/errors/user'
import { loginUserSchema } from '@/types'

export class LoginUserController {
  private loginUserUseCase: ILoginUserUseCase
  constructor(loginUserUseCase: ILoginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase
  }

  async execute(req: Pick<Request, 'body'>, res: HttpResponse) {
    try {
      const { email, password } = await loginUserSchema.parseAsync(req.body)

      const user = await this.loginUserUseCase.execute(email, password)

      return responseHelper.ok(res, user)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof EmailUserNotFoundError) {
        return responseHelper.notFound(res, error.message)
      }
      if (error instanceof InvalidCredentialsError) {
        return responseHelper.unauthorized(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao fazer login')
    }
  }
}
