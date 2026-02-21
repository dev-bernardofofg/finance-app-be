import {
  CreateTransactionController,
  DeleteTransactionController,
  GetTransactionByIdController,
  GetTransactionByUserIdController,
  UpdateTransactionController,
} from '../../controllers/transaction'
import {
  PostgresCreateTransactionRepository,
  PostgresDeleteTransactionRepository,
  PostgresGetTransactionByIdRepository,
  PostgresGetTransactionByUserIdRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateTransactionRepository,
} from '../../repositories/postgres'
import {
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
  GetTransactionByIdUseCase,
  GetTransactionByUserIdUseCase,
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

export const makeDeleteTransactionController = () => {
  const deleteTransactionRepository = new PostgresDeleteTransactionRepository()
  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    deleteTransactionRepository,
  )
  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionUseCase,
  )
  return deleteTransactionController
}

export const makeGetTransactionByUserIdController = () => {
  const getTransactionByUserIdRepository =
    new PostgresGetTransactionByUserIdRepository()
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const getTransactionByUserIdUseCase = new GetTransactionByUserIdUseCase(
    getTransactionByUserIdRepository,
    getUserByIdRepository,
  )
  const getTransactionByUserIdController = new GetTransactionByUserIdController(
    getTransactionByUserIdUseCase,
  )
  return getTransactionByUserIdController
}
