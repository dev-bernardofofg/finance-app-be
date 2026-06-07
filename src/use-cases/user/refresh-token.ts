import { TokenGeneratorAdapter } from '@/adapters'
import { TokenVerifyAdapter } from '@/adapters/token-verify'
import { UnauthorizedError } from '@/errors/user'

export interface IRefreshTokenUseCase {
  execute(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }>
}

export class RefreshTokenUseCase {
  private tokenGeneratorAdapter: TokenGeneratorAdapter
  private tokenVerifyAdapter: TokenVerifyAdapter
  constructor(
    tokenGeneratorAdapter: TokenGeneratorAdapter,
    tokenVerifyAdapter: TokenVerifyAdapter,
  ) {
    this.tokenGeneratorAdapter = tokenGeneratorAdapter
    this.tokenVerifyAdapter = tokenVerifyAdapter
  }

  execute(refreshToken: string) {
    try {
      const decodedToken = this.tokenVerifyAdapter.execute({
        token: refreshToken,
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      })

      if (!decodedToken) {
        throw new UnauthorizedError()
      }

      return this.tokenGeneratorAdapter.execute(decodedToken.user_id)
    } catch {
      throw new UnauthorizedError()
    }
  }
}
