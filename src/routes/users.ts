import { Request, Response, Router } from 'express'
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetBalanceUserController,
  makeGetUserByEmailController,
  makeGetUserByIdController,
  makeUpdateUserByIdController,
} from '../factories/controllers/user'

export const usersRoutes = Router()

usersRoutes.post('/', async (request: Request, response: Response) => {
  const getCreateUserController = makeCreateUserController()
  return getCreateUserController.execute(request, response)
})
usersRoutes.get('/', async (request: Request, response: Response) => {
  const getUserByEmailController = makeGetUserByEmailController()
  return getUserByEmailController.execute(request, response)
})
usersRoutes.get('/:id', async (request: Request, response: Response) => {
  const getUserByIdController = makeGetUserByIdController()
  return getUserByIdController.execute(request, response)
})
usersRoutes.patch('/:id', async (request: Request, response: Response) => {
  const updateUserByIdController = makeUpdateUserByIdController()
  return updateUserByIdController.execute(request, response)
})
usersRoutes.delete('/:id', async (request: Request, response: Response) => {
  const deleteUserController = makeDeleteUserController()
  return deleteUserController.execute(request, response)
})
usersRoutes.get(
  '/:id/balance',
  async (request: Request, response: Response) => {
    const getBalanceUserController = makeGetBalanceUserController()
    return getBalanceUserController.execute(request, response)
  },
)
