import { Router } from 'express'
import {
  CreateUserController,
  DeleteUserController,
  GetUserByEmailController,
  GetUserByIdController,
  UpdateUserController,
} from '../controllers'

export const usersRoutes = Router()

usersRoutes.post('/users', CreateUserController.execute)
usersRoutes.get('/users', GetUserByEmailController.execute)
usersRoutes.get('/users/:id', GetUserByIdController.execute)
usersRoutes.patch('/users/:id', UpdateUserController.execute)
usersRoutes.delete('/users/:id', DeleteUserController.execute)
