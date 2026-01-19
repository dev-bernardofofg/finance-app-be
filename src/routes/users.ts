import { Router } from 'express'
import {
  CreateUserController,
  DeleteUserController,
  GetUserByEmailController,
  GetUserByIdController,
  UpdateUserController,
} from '../controllers'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user'
import { PostgresDeleteUserRepository } from '../repositories/postgres/delete.user'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email'
import { PostgresGetUserByIdRepository } from '../repositories/postgres/get-user-by-id'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user'
import { CreateUserUseCase } from '../use-cases/create-user'
import { DeleteUserUseCase } from '../use-cases/delete.user'
import { GetUserByEmailUseCase } from '../use-cases/get-user-by-email'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id'
import { UpdateUserUseCase } from '../use-cases/update-user'

export const usersRoutes = Router()

// Instanciar controllers uma única vez
const createUserController = new CreateUserController(
  new CreateUserUseCase(new PostgresCreateUserRepository()),
)
const getUserByEmailController = new GetUserByEmailController(
  new GetUserByEmailUseCase(new PostgresGetUserByEmailRepository()),
)
const getUserByIdController = new GetUserByIdController(
  new GetUserByIdUseCase(new PostgresGetUserByIdRepository()),
)
const updateUserController = new UpdateUserController(
  new UpdateUserUseCase(new PostgresUpdateUserRepository()),
)
const deleteUserController = new DeleteUserController(
  new DeleteUserUseCase(new PostgresDeleteUserRepository()),
)

// Registrar rotas com bind para preservar o contexto
usersRoutes.post(
  '/users',
  createUserController.execute.bind(createUserController),
)
usersRoutes.get(
  '/users',
  getUserByEmailController.execute.bind(getUserByEmailController),
)
usersRoutes.get(
  '/users/:id',
  getUserByIdController.execute.bind(getUserByIdController),
)
usersRoutes.patch(
  '/users/:id',
  updateUserController.execute.bind(updateUserController),
)
usersRoutes.delete(
  '/users/:id',
  deleteUserController.execute.bind(deleteUserController),
)
