import { faker } from '@faker-js/faker'
import { makeHttpResponse } from '../../helpers/test'
import {
  ITransactionParams,
  ITransactionResponse,
  UpdateTransactionParams,
} from '../../types'
import { UpdateTransactionController } from './update.transaction'

describe('UpdateTransactionController', () => {
  class UpdateTransactionUseCaseStub {
    execute = jest.fn(
      async (
        transactionId: string,
        params: ITransactionParams,
      ): Promise<ITransactionResponse> => ({
        id: transactionId,
        user_id: faker.string.uuid(),
        name: params.name,
        type: params.type,
        amount: params.amount,
        date: params.date,
      }),
    )
  }

  const makeSut = () => {
    const updateTransactionUseCaseStub = new UpdateTransactionUseCaseStub()
    const sut = new UpdateTransactionController(updateTransactionUseCaseStub)
    return { sut, updateTransactionUseCaseStub }
  }

  // date é string ISO porque o updateTransactionSchema usa z.string().datetime()
  // O controller converte para Date internamente antes de passar ao use case
  const makeHttpRequest = (
    transactionId: string = faker.string.uuid(),
    body?: Partial<UpdateTransactionParams>,
  ) => ({
    params: { id: transactionId },
    body: {
      name: faker.commerce.productName(),
      type: faker.helpers.arrayElement([
        'INCOME',
        'EXPENSE',
        'INVESTMENT',
      ] as const),
      amount: faker.number.int({ min: 1, max: 100000 }),
      date: faker.date.recent().toISOString(),
      ...body,
    },
  })

  it('should return 200 when the transaction is updated successfully', async () => {
    // arrange
    const { sut } = makeSut()
    const transactionId = faker.string.uuid()
    const httpRequest = makeHttpRequest(transactionId)
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: transactionId,
        name: httpRequest.body.name,
        type: httpRequest.body.type,
        amount: httpRequest.body.amount,
      }),
    )
    expect(result).toBe(response)
  })

  it('should return 400 when the transaction id is invalid', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest('id-invalido')
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

  it('should return 400 when the body is invalid', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest(faker.string.uuid(), { amount: 0 })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O valor da transação em centavos deve ser maior que 0',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when body is not an object', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = {
      params: { id: faker.string.uuid() },
      body: null,
    }
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest as never, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(result).toBe(response)
  })

  it('should return 400 when unallowed field is sent', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest(faker.string.uuid(), {
      unallowed_field: '123',
    } as never)
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Campos inválidos: unallowed_field',
    })
    expect(result).toBe(response)
  })

  it('should return 404 when the transaction is not found', async () => {
    // arrange
    const { sut, updateTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    updateTransactionUseCaseStub.execute.mockResolvedValueOnce(null as never)

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Transação não encontrada',
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    // arrange
    const { sut, updateTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    updateTransactionUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao atualizar transação',
    })
    expect(result).toBe(response)
  })
})
