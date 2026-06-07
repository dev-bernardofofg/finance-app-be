import jwt from 'jsonwebtoken'

export class TokenGeneratorAdapter {
  async execute(user_id: string) {
    return {
      access_token: jwt.sign(
        { user_id },
        process.env.JWT_ACCESS_TOKEN_SECRET as string,
        { expiresIn: '15m' },
      ),
      refresh_token: jwt.sign(
        { user_id },
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
        { expiresIn: '30d' },
      ),
    }
  }
}
