import { faker } from '@faker-js/faker'
import { TransactionNotFoundError } from '../../errors/transaction'
import { makeHttpRequestById, makeHttpResponse } from '../../helpers/test'
import { ITransactionResponse } from '../../types'
import { GetTransactionByIdController } from './get-by-id.transaction'

describe('GetTransactionByIdController', () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.person.firstName(),
    type: faker.helpers.arrayElement(['INCOME', 'EXPENSE', 'INVESTMENT']),
    amount: Number(faker.finance.amount()),
    date: faker.date.recent().toISOString(),
    created_at: faker.date.recent().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }
  class GetTransactionByIdUseCaseStub {
    execute = jest.fn(async (): Promise<ITransactionResponse> => transaction)
  }

  const makeSut = () => {
    const getTransactionByIdUseCaseStub = new GetTransactionByIdUseCaseStub()
    const sut = new GetTransactionByIdController(getTransactionByIdUseCaseStub)
    return { sut, getTransactionByIdUseCaseStub }
  }

  it('should return 200 when the transaction is found', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequestById({ id: transaction.id })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(200)
    expect(result).toBe(response)
  })

  it('should return 400 when the transaction id is invalid', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequestById({ id: 'invalid-id' })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O ID da transação deve ser um UUID válido',
    })
    expect(result).toBe(response)
  })

  it('should return 404 when the transaction is not found', async () => {
    // arrange
    const { sut, getTransactionByIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: faker.string.uuid() })
    const { response } = makeHttpResponse()
    getTransactionByIdUseCaseStub.execute.mockRejectedValueOnce(
      new TransactionNotFoundError(httpRequest.params.id),
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Transação com ID ${httpRequest.params.id} não encontrada.`,
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    // arrange
    const { sut, getTransactionByIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: faker.string.uuid() })
    const { response } = makeHttpResponse()
    getTransactionByIdUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar transação',
    })
    expect(result).toBe(response)
  })
})
