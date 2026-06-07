import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { responseHelper } from '@/controllers/helpers/http'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [scheme, token] = req.headers.authorization?.split(' ') ?? []

    if (scheme !== 'Bearer' || !token) {
      return responseHelper.unauthorized(res, 'Token de acesso não fornecido')
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      { algorithms: ['HS256'] },
    ) as JwtPayload

    if (!decoded?.user_id) {
      return responseHelper.unauthorized(res, 'Token de acesso inválido')
    }

    req.user_id = decoded.user_id
    next()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token inválido'
    return responseHelper.unauthorized(res, message)
  }
}
