import { Router } from 'express'
import { CreateUserController } from '../controllers/create-user'

export const usersRoutes = Router()

usersRoutes.post('/users', CreateUserController.execute)
