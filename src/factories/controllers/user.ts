import {
  CreateUserController,
  DeleteUserController,
  GetUserByEmailController,
  GetUserByIdController,
  UpdateUserController,
} from '../../controllers'
import {
  PostgresCreateUserRepository,
  PostgresDeleteUserRepository,
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateUserRepository,
} from '../../repositories/postgres'
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByEmailUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from '../../use-cases/user'

export const makeGetUserByIdController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  return getUserByIdController
}

export const makeGetUserByEmailController = () => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
  const getUserByEmailUseCase = new GetUserByEmailUseCase(
    getUserByEmailRepository,
  )
  const getUserByEmailController = new GetUserByEmailController(
    getUserByEmailUseCase,
  )

  return getUserByEmailController
}

export const makeUpdateUserByIdController = () => {
  const updateUserRepository = new PostgresUpdateUserRepository()
  const updateUserUseCase = new UpdateUserUseCase(updateUserRepository)
  const updateUserController = new UpdateUserController(updateUserUseCase)

  return updateUserController
}

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository()
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  return deleteUserController
}

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository()
  const createUserUseCase = new CreateUserUseCase(createUserRepository)
  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}
