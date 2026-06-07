import { Request } from 'express'
import { UserNotFoundError } from '@/errors/user'
import { makeHttpResponse } from '@/helpers/test'
import {
  transactionFixture,
  transactionFixtureWithoutId,
} from '@/test/fixtures/transaction'
import {
  CreateTransactionInput,
  ITransactionParams,
  ITransactionResponse,
} from '@/types'
import { CreateTransactionController } from './create.transaction'

describe('CreateTransactionController', () => {
  class CreateTransactionUseCaseStub {
    execute = jest.fn(
      async (_params: ITransactionParams): Promise<ITransactionResponse> =>
        transactionFixture,
    )
  }

  const makeSut = () => {
    const createTransactionUseCaseStub = new CreateTransactionUseCaseStub()
    const sut = new CreateTransactionController(createTransactionUseCaseStub)
    return { sut, createTransactionUseCaseStub }
  }

  const makeHttpRequest = (body?: Partial<CreateTransactionInput>) => {
    const { user_id: _userId, ...rest } = transactionFixtureWithoutId
    return {
      body: { ...rest, ...body },
      params: { user_id: transactionFixture.user_id },
    } as unknown as Request
  }

  it('should return 201 when the transaction is created successfully', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    const result = await sut.execute(httpRequest, response)
    expect(response.status).toHaveBeenCalledWith(201)
    expect(result).toBe(response)
  })

  it('should return 400 when the sent data is invalid', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ amount: 0 })
    const { response } = makeHttpResponse()
    const result = await sut.execute(httpRequest, response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O valor da transação em centavos deve ser maior que 0',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when name is missing', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ name: undefined })
    const { response } = makeHttpResponse()
    const result = await sut.execute(httpRequest, response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O nome da transação é obrigatório',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when type is missing', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ type: undefined })
    const { response } = makeHttpResponse()
    const result = await sut.execute(httpRequest, response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message:
        'O tipo de transação deve ser "INCOME", "EXPENSE" ou "INVESTMENT"',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when date is missing', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ date: undefined })
    const { response } = makeHttpResponse()
    const result = await sut.execute(httpRequest, response)
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'A data da transação é obrigatória',
    })
    expect(result).toBe(response)
  })

  it('should return 404 when the user is not found', async () => {
    const { sut, createTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    const user_id = httpRequest.params.user_id

    createTransactionUseCaseStub.execute.mockRejectedValueOnce(
      new UserNotFoundError(user_id),
    )

    const result = await sut.execute(httpRequest, response)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Usuário com ID ${user_id} não encontrado.`,
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    const { sut, createTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    createTransactionUseCaseStub.execute.mockRejectedValueOnce(new Error())

    const result = await sut.execute(httpRequest, response)
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao criar transação',
    })
    expect(result).toBe(response)
  })

  it('should call CreateTransactionUseCase with the correct parameters', async () => {
    const { sut, createTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    const executeSpy = jest.spyOn(createTransactionUseCaseStub, 'execute')

    await sut.execute(httpRequest, response)

    expect(executeSpy).toHaveBeenCalledWith({
      ...httpRequest.body,
      user_id: httpRequest.params.user_id,
    })
  })
})
