import { Request, Response, Router } from 'express'
import {
  makeCreateTransactionController,
  makeGetTransactionByIdController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
} from '../factories/controllers/transaction'

export const transactionsRoutes = Router()

transactionsRoutes.post('/', async (request: Request, response: Response) => {
  const createTransactionController = makeCreateTransactionController()
  return createTransactionController.execute(request, response)
})
transactionsRoutes.get('/:id', async (request: Request, response: Response) => {
  const getTransactionByIdController = makeGetTransactionByIdController()
  return getTransactionByIdController.execute(request, response)
})
transactionsRoutes.put('/:id', async (request: Request, response: Response) => {
  const updateTransactionController = makeUpdateTransactionController()
  return updateTransactionController.execute(request, response)
})

transactionsRoutes.get('/', async (request: Request, response: Response) => {
  const getTransactionByUserIdController =
    makeGetTransactionByUserIdController()
  return getTransactionByUserIdController.execute(request, response)
})
