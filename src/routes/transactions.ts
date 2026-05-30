import { Request, Response, Router } from 'express'
import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionByIdController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
} from '@/factories/controllers/transaction'
import { authMiddleware } from '@/middlewares/auth'
import { AuthenticatedRequest } from '@/types'

export const transactionsRoutes = Router()

transactionsRoutes.post(
  '/',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { userId } = request as AuthenticatedRequest
    const createTransactionController = makeCreateTransactionController()
    return createTransactionController.execute(
      { ...request, params: { ...request.params, userId } },
      response,
    )
  },
)

transactionsRoutes.get(
  '/',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { userId } = request as AuthenticatedRequest
    const getTransactionByUserIdController =
      makeGetTransactionByUserIdController()
    return getTransactionByUserIdController.execute(
      {
        ...request,
        params: { userId },
      },
      response,
    )
  },
)

transactionsRoutes.get(
  '/:id',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { userId } = request as AuthenticatedRequest
    const getTransactionByIdController = makeGetTransactionByIdController()
    return getTransactionByIdController.execute(
      { ...request, params: { ...request.params, userId } },
      response,
    )
  },
)

transactionsRoutes.put(
  '/:id',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { userId } = request as AuthenticatedRequest
    const updateTransactionController = makeUpdateTransactionController()
    return updateTransactionController.execute(
      { ...request, params: { ...request.params, userId } },
      response,
    )
  },
)

transactionsRoutes.delete(
  '/:id',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { userId } = request as AuthenticatedRequest
    const deleteTransactionController = makeDeleteTransactionController()
    return deleteTransactionController.execute(
      { ...request, params: { ...request.params, userId } },
      response,
    )
  },
)
