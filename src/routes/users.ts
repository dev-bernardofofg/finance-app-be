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
  '/',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { userId } = request as AuthenticatedRequest
    const getUserByIdController = makeGetUserByIdController()
    return getUserByIdController.execute(
      {
        ...request,
        params: {
          id: userId,
        },
      },
      response,
    )
  },
)
usersRoutes.patch(
  '/',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { userId } = request as AuthenticatedRequest
    const updateUserByIdController = makeUpdateUserByIdController()
    return updateUserByIdController.execute(
      {
        ...request,
        params: {
          id: userId,
        },
      },
      response,
    )
  },
)
usersRoutes.delete(
  '/',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { userId } = request as AuthenticatedRequest
    const deleteUserController = makeDeleteUserController()
    return deleteUserController.execute(
      {
        ...request,
        params: {
          id: userId,
        },
      },
      response,
    )
  },
)
usersRoutes.get(
  '/balance',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { userId } = request as AuthenticatedRequest
    const getBalanceUserController = makeGetBalanceUserController()
    return getBalanceUserController.execute(
      {
        ...request,
        params: {
          id: userId,
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
