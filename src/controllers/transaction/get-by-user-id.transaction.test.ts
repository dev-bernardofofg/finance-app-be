import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { makeHttpResponse } from '../../helpers/test'
import { GetTransactionByUserIdParams } from '../../repositories/postgres'
import { ITransactionResponse } from '../../types'
import { GetTransactionByUserIdController } from './get-by-user-id.transaction'

describe('GetTransactionByUserIdController', () => {
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
  class GetTransactionByUserIdUseCaseStub {
    execute = jest.fn(
      async (
        _params: GetTransactionByUserIdParams,
      ): Promise<ITransactionResponse[]> => [transaction],
    )
  }

  const makeSut = () => {
    const getTransactionByUserIdUseCaseStub =
      new GetTransactionByUserIdUseCaseStub()
    const sut = new GetTransactionByUserIdController(
      getTransactionByUserIdUseCaseStub,
    )
    return { sut, getTransactionByUserIdUseCaseStub }
  }

  const makeHttpRequest = (userId: string) => ({
    query: { userId },
  })

  it('should return 200 when the transactions are found successfully', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest(faker.string.uuid())
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(200)
    expect(result).toBe(response)
  })

  it('should return 400 when the user id is invalid', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest('invalid-id')
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O campo userId deve ser um UUID válido',
    })
    expect(result).toBe(response)
  })

  it('should return 404 when the transactions are not found', async () => {
    // arrange
    const { sut, getTransactionByUserIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(faker.string.uuid())
    const { response } = makeHttpResponse()
    getTransactionByUserIdUseCaseStub.execute.mockResolvedValueOnce(
      null as never,
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Transações não encontradas',
    })
    expect(result).toBe(response)
  })

  it('should return 404 when the user is not found', async () => {
    // arrange
    const { sut, getTransactionByUserIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(faker.string.uuid())
    const { response } = makeHttpResponse()
    getTransactionByUserIdUseCaseStub.execute.mockResolvedValueOnce(
      null as never,
    )

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Transações não encontradas',
    })
    expect(result).toBe(response)
  })

  it('should call GetUserIdUseCase with the correct userId', async () => {
    // arrange
    const { sut, getTransactionByUserIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(faker.string.uuid())
    const { response } = makeHttpResponse()

    // act
    await sut.execute(httpRequest, response)

    // assert
    expect(getTransactionByUserIdUseCaseStub.execute).toHaveBeenCalledWith({
      userId: httpRequest.query.userId,
    })
  })

  it('should call GetTransactionByUserIdUseCase with the incorrect parameters', async () => {
    // arrange
    const { sut, getTransactionByUserIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest('invalid-id')
    const { response } = makeHttpResponse()

    // act
    await sut.execute(httpRequest, response)

    // assert
    expect(getTransactionByUserIdUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O campo userId deve ser um UUID válido',
    })
  })

  it('should return 404 when UserNotFoundError is thrown', async () => {
    // arrange
    const { sut, getTransactionByUserIdUseCaseStub } = makeSut()
    const userId = faker.string.uuid()
    const httpRequest = makeHttpRequest(userId)
    const { response } = makeHttpResponse()
    getTransactionByUserIdUseCaseStub.execute.mockRejectedValueOnce(
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
    const { sut, getTransactionByUserIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest(faker.string.uuid())
    const { response } = makeHttpResponse()
    getTransactionByUserIdUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar transações',
    })
    expect(result).toBe(response)
  })
})
