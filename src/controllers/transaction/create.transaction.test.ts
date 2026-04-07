import { faker } from '@faker-js/faker'
import { Request } from 'express'
import { UserNotFoundError } from '../../errors/user'
import { makeHttpResponse } from '../../helpers/test'
import {
  CreateTransactionParams,
  ITransactionParams,
  ITransactionResponse,
} from '../../types'
import { CreateTransactionController } from './create.transaction'

describe('CreateTransactionController', () => {
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
  class CreateTransactionUseCaseStub {
    execute = jest.fn(
      async (_params: ITransactionParams): Promise<ITransactionResponse> =>
        transaction,
    )
  }

  const makeSut = () => {
    const createTransactionUseCaseStub = new CreateTransactionUseCaseStub()
    const sut = new CreateTransactionController(createTransactionUseCaseStub)
    return { sut, createTransactionUseCaseStub }
  }

  const makeHttpRequest = (body?: Partial<CreateTransactionParams>) =>
    ({
      body: {
        user_id: faker.string.uuid(),
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
    }) as Request

  it('should return 201 when the transaction is created successfully', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(201)
    expect(result).toBe(response)
  })

  it('should return 400 when the sent data is invalid', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ amount: 0 })
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

  it('should return 400 when missing user_id', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ user_id: undefined })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O ID do usuário é obrigatório',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when name is missing', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ name: undefined })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O nome da transação é obrigatório',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when type is missing', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ type: undefined })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message:
        'O tipo de transação deve ser "INCOME", "EXPENSE" ou "INVESTMENT"',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when date is missing', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ date: undefined })
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'A data da transação é obrigatória',
    })
    expect(result).toBe(response)
  })

  it('should return 404 when the user is not found', async () => {
    // arrange
    const { sut, createTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    const userId = httpRequest.body.user_id as string

    // mockRejectedValueOnce simula o use case lançando um erro na próxima chamada.
    // "Once" significa que só afeta a próxima execução — depois volta ao comportamento padrão.
    createTransactionUseCaseStub.execute.mockRejectedValueOnce(
      new UserNotFoundError(userId),
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Usuário com ID ${userId} não encontrado.`,
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    // arrange
    const { sut, createTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    // new Error() genérico não é ZodError nem UserNotFoundError,
    // então cai no último catch do controller → 500
    createTransactionUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao criar transação',
    })
    expect(result).toBe(response)
  })

  it('should call CreateTransactionUseCase with the correct parameters', async () => {
    // arrange
    const { sut, createTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    const executeSpy = jest.spyOn(createTransactionUseCaseStub, 'execute')

    // act
    await sut.execute(httpRequest, response)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
