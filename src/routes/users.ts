import { Router } from 'express'
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByEmailController,
  makeGetUserByIdController,
  makeUpdateUserByIdController,
} from '../factories/controllers/user'

export const usersRoutes = Router()

usersRoutes.post('/users', async (request, response) => {
  const getCreateUserController = makeCreateUserController()
  return getCreateUserController.execute(request, response)
})
usersRoutes.get('/users', async (request, response) => {
  const getUserByEmailController = makeGetUserByEmailController()
  return getUserByEmailController.execute(request, response)
})
usersRoutes.get('/users/:id', async (request, response) => {
  const getUserByIdController = makeGetUserByIdController()
  return getUserByIdController.execute(request, response)
})
usersRoutes.patch('/users/:id', async (request, response) => {
  const updateUserByIdController = makeUpdateUserByIdController()
  return updateUserByIdController.execute(request, response)
})
usersRoutes.delete('/users/:id', async (request, response) => {
  const deleteUserController = makeDeleteUserController()
  return deleteUserController.execute(request, response)
})
