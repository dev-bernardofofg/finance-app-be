import jwt from 'jsonwebtoken'

export class TokenGeneratorAdapter {
  async execute(userId: string) {
    return {
      access_token: jwt.sign(
        { userId },
        process.env.JWT_ACCESS_TOKEN_SECRET as string,
        { expiresIn: '15m' },
      ),
      refresh_token: jwt.sign(
        { userId },
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
        { expiresIn: '30d' },
      ),
    }
  }
}
