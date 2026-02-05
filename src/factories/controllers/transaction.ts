import {
  CreateTransactionController,
  GetTransactionByIdController,
  UpdateTransactionController,
} from '../../controllers/transaction'
import {
  PostgresCreateTransactionRepository,
  PostgresGetTransactionByIdRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateTransactionRepository,
} from '../../repositories/postgres'
import {
  CreateTransactionUseCase,
  GetTransactionByIdUseCase,
  UpdateTransactionUseCase,
} from '../../use-cases/transaction'

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository()
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserByIdRepository,
  )
  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  )
  return createTransactionController
}

export const makeGetTransactionByIdController = () => {
  const getTransactionByIdRepository =
    new PostgresGetTransactionByIdRepository()
  const getTransactionByIdUseCase = new GetTransactionByIdUseCase(
    getTransactionByIdRepository,
  )
  const getTransactionByIdController = new GetTransactionByIdController(
    getTransactionByIdUseCase,
  )
  return getTransactionByIdController
}

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository()
  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
  )
  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  )
  return updateTransactionController
}
