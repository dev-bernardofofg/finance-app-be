import {
  CreateTransactionController,
  DeleteTransactionController,
  GetTransactionByIdController,
  GetTransactionByUserIdController,
  UpdateTransactionController,
} from '../../controllers/transaction'
import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionByIdController,
  makeGetTransactionByUserIdController,
  makeUpdateTransactionController,
} from './transaction'

describe('TransactionControllersFactory', () => {
  it('should return a CreateTransactionController', () => {
    // arrange
    const controller = makeCreateTransactionController()
    // assert
    expect(controller).toBeInstanceOf(CreateTransactionController)
  })

  it('should return a DeleteTransactionController', () => {
    // arrange
    const controller = makeDeleteTransactionController()
    // assert
    expect(controller).toBeInstanceOf(DeleteTransactionController)
  })

  it('should return a GetTransactionByIdController', () => {
    // arrange
    const controller = makeGetTransactionByIdController()
    // assert
    expect(controller).toBeInstanceOf(GetTransactionByIdController)
  })

  it('should return a GetTransactionByUserIdController', () => {
    // arrange
    const controller = makeGetTransactionByUserIdController()
    // assert
    expect(controller).toBeInstanceOf(GetTransactionByUserIdController)
  })

  it('should return a UpdateTransactionController', () => {
    // arrange
    const controller = makeUpdateTransactionController()
    // assert
    expect(controller).toBeInstanceOf(UpdateTransactionController)
  })
})
