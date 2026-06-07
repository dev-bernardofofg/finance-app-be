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
    const { user_id } = request as AuthenticatedRequest
    const createTransactionController = makeCreateTransactionController()
    return createTransactionController.execute(
      { ...request, params: { user_id }, body: { ...request.body } },
      response,
    )
  },
)

transactionsRoutes.get(
  '/',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { user_id } = request as AuthenticatedRequest
    const { from_date, to_date } = request.query as {
      from_date?: string
      to_date?: string
    }
    const getTransactionByUserIdController =
      makeGetTransactionByUserIdController()
    return getTransactionByUserIdController.execute(
      {
        ...request,
        params: {
          user_id,
          from_date: from_date as string,
          to_date: to_date as string,
        },
      },
      response,
    )
  },
)

transactionsRoutes.get(
  '/:id',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { user_id } = request as AuthenticatedRequest
    const getTransactionByIdController = makeGetTransactionByIdController()
    return getTransactionByIdController.execute(
      { ...request, params: { ...request.params, user_id } },
      response,
    )
  },
)

transactionsRoutes.put(
  '/:id',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { user_id } = request as AuthenticatedRequest
    const updateTransactionController = makeUpdateTransactionController()
    return updateTransactionController.execute(
      {
        ...request,
        params: { user_id, id: request.params.id },
        body: { ...request.body },
      },
      response,
    )
  },
)

transactionsRoutes.delete(
  '/:id',
  authMiddleware,
  async (request: Request, response: Response) => {
    const { user_id } = request as AuthenticatedRequest
    const deleteTransactionController = makeDeleteTransactionController()
    return deleteTransactionController.execute(
      { ...request, params: { ...request.params, user_id } },
      response,
    )
  },
)
