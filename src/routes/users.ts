import { Request, Response, Router } from 'express'
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetBalanceUserController,
  makeGetUserByIdController,
  makeLoginUserController,
  makeRefreshTokenController,
  makeUpdateUserByIdController,
} from '@/factories/controllers/user'
import { authMiddleware } from '@/middlewares/auth'
import { AuthenticatedRequest } from '@/types'

export const usersRoutes = Router()

usersRoutes.post('/', async (request: Request, response: Response) => {
  const getCreateUserController = makeCreateUserController()
  return getCreateUserController.execute(request, response)
})

usersRoutes.get(
  '/me',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { user_id } = request as AuthenticatedRequest
    const getUserByIdController = makeGetUserByIdController()
    return getUserByIdController.execute(
      {
        ...request,
        params: {
          id: user_id,
        },
      },
      response,
    )
  },
)

usersRoutes.patch(
  '/me',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { user_id } = request as AuthenticatedRequest
    const updateUserByIdController = makeUpdateUserByIdController()
    return updateUserByIdController.execute(
      {
        ...request,
        params: {
          id: user_id,
        },
      },
      response,
    )
  },
)

usersRoutes.delete(
  '/me',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { user_id } = request as AuthenticatedRequest
    const deleteUserController = makeDeleteUserController()
    return deleteUserController.execute(
      {
        ...request,
        params: {
          id: user_id,
        },
      },
      response,
    )
  },
)

usersRoutes.get(
  '/me/balance',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { user_id } = request as AuthenticatedRequest
    const getBalanceUserController = makeGetBalanceUserController()
    return getBalanceUserController.execute(
      {
        ...request,
        params: {
          id: user_id,
        },
        query: {
          from_date: request.query.from_date,
          to_date: request.query.to_date,
        },
      },
      response,
    )
  },
)

usersRoutes.post('/login', async (request: Request, response: Response) => {
  const loginUserController = makeLoginUserController()
  return loginUserController.execute(request, response)
})

usersRoutes.post(
  '/refresh-token',
  async (request: Request, response: Response) => {
    const refreshTokenController = makeRefreshTokenController()
    return refreshTokenController.execute(request, response)
  },
)
