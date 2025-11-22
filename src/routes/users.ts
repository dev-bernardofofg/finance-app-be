import { Router } from 'express'
import { CreateUserController } from '../controllers/create-user'
import { GetUserByEmailController } from '../controllers/get-user-by-email'
import { GetUserByIdController } from '../controllers/get-user-by-id'

export const usersRoutes = Router()

usersRoutes.post('/users', CreateUserController.execute)
usersRoutes.get('/users', GetUserByEmailController.execute)
usersRoutes.get('/users/:id', GetUserByIdController.execute)
