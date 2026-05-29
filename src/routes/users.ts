import { Request, Response, Router } from 'express'
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetBalanceUserController,
  makeGetUserByEmailController,
  makeGetUserByIdController,
  makeLoginUserController,
  makeUpdateUserByIdController,
} from '@/factories/controllers/user'
import { authMiddleware } from '@/middlewares/auth'

export const usersRoutes = Router()

usersRoutes.post('/', async (request: Request, response: Response) => {
  const getCreateUserController = makeCreateUserController()
  return getCreateUserController.execute(request, response)
})
usersRoutes.get(
  '/',
  authMiddleware,
  async (request: Request, response: Response) => {
    const getUserByEmailController = makeGetUserByEmailController()
    return getUserByEmailController.execute(request, response)
  },
)
usersRoutes.get(
  '/:id',
  authMiddleware,
  async (request: Request, response: Response) => {
    const getUserByIdController = makeGetUserByIdController()
    return getUserByIdController.execute(request, response)
  },
)
usersRoutes.patch(
  '/:id',
  authMiddleware,
  async (request: Request, response: Response) => {
    const updateUserByIdController = makeUpdateUserByIdController()
    return updateUserByIdController.execute(request, response)
  },
)
usersRoutes.delete(
  '/:id',
  authMiddleware,
  async (request: Request, response: Response) => {
    const deleteUserController = makeDeleteUserController()
    return deleteUserController.execute(request, response)
  },
)
usersRoutes.get(
  '/:id/balance',
  authMiddleware,
  async (request: Request, response: Response) => {
    const getBalanceUserController = makeGetBalanceUserController()
    return getBalanceUserController.execute(request, response)
  },
)

usersRoutes.post('/login', async (request: Request, response: Response) => {
  const loginUserController = makeLoginUserController()
  return loginUserController.execute(request, response)
})
