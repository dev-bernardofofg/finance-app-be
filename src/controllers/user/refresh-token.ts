import { IRefreshTokenUseCase } from '@/use-cases/user/refresh-token'
import { HttpResponse, responseHelper } from '@/controllers/helpers/http'
import { UnauthorizedError } from '@/errors/user'
import { refreshTokenSchema } from '@/types'
import { ZodError } from 'zod'

export class RefreshTokenController {
  private refreshTokenUseCase: IRefreshTokenUseCase
  constructor(refreshTokenUseCase: IRefreshTokenUseCase) {
    this.refreshTokenUseCase = refreshTokenUseCase
  }

  async execute(req: Pick<Request, 'body'>, res: HttpResponse) {
    try {
      const { refreshToken } = await refreshTokenSchema.parseAsync(req.body)

      const token = await this.refreshTokenUseCase.execute(refreshToken)

      return responseHelper.ok(res, token)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }
      if (error instanceof UnauthorizedError) {
        return responseHelper.unauthorized(res, error.message)
      }
      return responseHelper.internalServerError(res, 'Erro ao atualizar token')
    }
  }
}
