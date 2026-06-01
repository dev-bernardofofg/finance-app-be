import jwt from 'jsonwebtoken'

type TokenVerifyAdapterProps = {
  token: string
  secret?: string
}

export class TokenVerifyAdapter {
  execute({
    token,
    secret = process.env.JWT_SECRET as string,
  }: TokenVerifyAdapterProps) {
    return jwt.verify(token, secret) as { userId: string }
  }
}
