import { faker } from '@faker-js/faker'
import { Request } from 'express'
import { UserNotFoundError } from '../../errors/user'
import { makeHttpResponse } from '../../helpers/test'
import { CreateTransactionParams, ITransactionResponse } from '../../types'
import { CreateTransactionController } from './create.transaction'

describe('CreateTransactionController', () => {
  class CreateTransactionUseCaseStub {
    execute = jest.fn(
      async (params: {
        user_id: string
        name: string
        type: 'INCOME' | 'EXPENSE' | 'INVESTMENT'
        amount: number
        date: Date
      }): Promise<ITransactionResponse> => ({
        id: faker.string.uuid(),
        user_id: params.user_id,
        name: params.name,
        type: params.type,
        amount: params.amount,
        date: params.date,
      }),
    )
  }

  const makeSut = () => {
    const createTransactionUseCaseStub = new CreateTransactionUseCaseStub()
    const sut = new CreateTransactionController(createTransactionUseCaseStub)
    return { sut, createTransactionUseCaseStub }
  }

  const makeHttpRequest = (body?: Partial<CreateTransactionParams>) => {
    const dateIso = faker.date.recent().toISOString()
    return {
      body: {
        amount: faker.number.int({ min: 1, max: 1000 }),
        type: faker.helpers.arrayElement([
          'INCOME',
          'EXPENSE',
          'INVESTMENT',
        ] as const),
        user_id: faker.string.uuid(),
        name: faker.person.firstName(),
        date: dateIso,
        ...body,
      },
    } as Request
  }

  it('should return 201 when the transaction is created successfully', async () => {
    const { sut, createTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    const expectedDate = new Date(httpRequest.body.date as string)

    const result = await sut.execute(httpRequest, response)

    expect(createTransactionUseCaseStub.execute).toHaveBeenCalledWith({
      user_id: httpRequest.body.user_id,
      name: httpRequest.body.name,
      type: httpRequest.body.type,
      amount: httpRequest.body.amount,
      date: expectedDate,
    })
    expect(response.status).toHaveBeenCalledWith(201)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        user_id: httpRequest.body.user_id,
        name: httpRequest.body.name,
        type: httpRequest.body.type,
        amount: httpRequest.body.amount,
        date: expectedDate,
      }),
    )
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

  it('should return 404 when the user is not found', async () => {
    const { sut, createTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    const userId = httpRequest.body.user_id as string

    createTransactionUseCaseStub.execute.mockRejectedValueOnce(
      new UserNotFoundError(userId),
    )

    const result = await sut.execute(httpRequest, response)

    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Usuário com ID ${userId} não encontrado.`,
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
})
