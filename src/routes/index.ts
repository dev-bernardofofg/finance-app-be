import { Router } from 'express'
import { transactionsRoutes } from './transactions'
import { usersRoutes } from './users'

export const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/transactions', transactionsRoutes)
