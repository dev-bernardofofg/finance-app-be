import {
  CreateUserController,
  DeleteUserController,
  GetBalanceUserController,
  GetUserByEmailController,
  GetUserByIdController,
  UpdateUserController,
} from '../../controllers'
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetBalanceUserController,
  makeGetUserByEmailController,
  makeGetUserByIdController,
  makeUpdateUserByIdController,
} from './user'

describe('UserControllersFactory', () => {
  it('should return a GetUserByIdController', () => {
    // arrange
    const controller = makeGetUserByIdController()
    // assert
    expect(controller).toBeInstanceOf(GetUserByIdController)
  })

  it('should return a CreateUserController', () => {
    // arrange
    const controller = makeCreateUserController()
    // assert
    expect(controller).toBeInstanceOf(CreateUserController)
  })

  it('should retuFrn a DeleteUserController', () => {
    // arrange
    const controller = makeDeleteUserController()
    // assert
    expect(controller).toBeInstanceOf(DeleteUserController)
  })

  it('should return a GetBalanceUserController', () => {
    // arrange
    const controller = makeGetBalanceUserController()
    // assert
    expect(controller).toBeInstanceOf(GetBalanceUserController)
  })

  it('should return a GetUserByEmailController', () => {
    // arrange
    const controller = makeGetUserByEmailController()
    // assert
    expect(controller).toBeInstanceOf(GetUserByEmailController)
  })

  it('should return a UpdateUserByIdController', () => {
    // arrange
    const controller = makeUpdateUserByIdController()
    // assert
    expect(controller).toBeInstanceOf(UpdateUserController)
  })
})
