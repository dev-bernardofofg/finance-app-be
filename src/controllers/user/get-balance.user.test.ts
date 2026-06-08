import { UserNotFoundError } from '@/errors/user'
import { makeHttpRequestById, makeHttpResponse } from '@/helpers/test'
import { GetBalanceUserResponse } from '@/repositories/postgres/user/get-balance.user'
import { balanceFixture } from '@/test/fixtures/balance'
import { userFixture } from '@/test/fixtures/user'
import { GetBalanceUserController } from './get-balance.user'
describe('GetBalanceUserController', () => {
  class GetBalanceUserUseCaseStub {
    execute = jest.fn(
      async (): Promise<GetBalanceUserResponse> => balanceFixture,
    )
  }

  const makeSut = () => {
    const getBalanceUserUseCaseStub = new GetBalanceUserUseCaseStub()
    const stub = new GetBalanceUserController(getBalanceUserUseCaseStub)
    return { stub, getBalanceUserUseCaseStub }
  }

  it('should return 200 when getting user balance', async () => {
    const { stub, getBalanceUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: userFixture.id })
    const { response } = makeHttpResponse()

    const result = await stub.execute(httpRequest, response)

    expect(getBalanceUserUseCaseStub.execute).toHaveBeenCalledWith({
      id: userFixture.id,
    })
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        total_income: expect.any(Number),
        total_expenses: expect.any(Number),
        total_investments: expect.any(Number),
        balance: expect.any(Number),
      }),
    )
    expect(result).toBe(response)
  })

  it('should return 404 when user not found', async () => {
    // arrange
    const { stub, getBalanceUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: userFixture.id })
    const { response } = makeHttpResponse()

    getBalanceUserUseCaseStub.execute.mockRejectedValueOnce(
      new UserNotFoundError(userFixture.id),
    )

    // act
    const result = await stub.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Usuário com ID ${userFixture.id} não encontrado.`,
    })
    expect(result).toBe(response)
  })

  it('should return 400 when the user id is missing', async () => {
    // arrange
    const { stub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: undefined })
    const { response } = makeHttpResponse()

    // act
    const result = await stub.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O ID do usuário é obrigatório',
    })
    expect(result).toBe(response)
  })

  it('should return 404 when the balance is not found', async () => {
    // arrange
    const { stub, getBalanceUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById()
    const { response } = makeHttpResponse()

    getBalanceUserUseCaseStub.execute.mockResolvedValueOnce(null as never)

    // act
    const result = await stub.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Saldo não encontrado',
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    // arrange
    const { stub, getBalanceUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById()
    const { response } = makeHttpResponse()

    getBalanceUserUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const result = await stub.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar saldo',
    })
    expect(result).toBe(response)
  })

  it('should call GetBalanceUserUseCase with the correct parameters', async () => {
    // arrange
    const { stub, getBalanceUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById()
    const { response } = makeHttpResponse()
    const executeSpy = jest.spyOn(getBalanceUserUseCaseStub, 'execute')

    // act
    await stub.execute(httpRequest, response)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ id: httpRequest.params.id })
  })

  it('should return 400 when only to_date is provided', async () => {
    // arrange
    const { stub } = makeSut()
    const httpRequest = makeHttpRequestById(
      { id: userFixture.id },
      { to_date: new Date().toISOString() },
    )
    const { response } = makeHttpResponse()

    // act
    const result = await stub.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message:
        'A data de início é obrigatória quando a data de fim é informada',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when only from_date is provided', async () => {
    // arrange
    const { stub } = makeSut()
    const httpRequest = makeHttpRequestById(
      { id: userFixture.id },
      { from_date: new Date().toISOString() },
    )
    const { response } = makeHttpResponse()

    // act
    const result = await stub.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message:
        'A data de fim é obrigatória quando a data de início é informada',
    })
    expect(result).toBe(response)
  })

  it('should return 400 when from_date is greater than to_date', async () => {
    // arrange
    const { stub } = makeSut()
    const httpRequest = makeHttpRequestById(
      { id: userFixture.id },
      {
        from_date: '2026-06-10T00:00:00.000Z',
        to_date: '2026-06-01T00:00:00.000Z',
      },
    )
    const { response } = makeHttpResponse()

    // act
    const result = await stub.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'A data de início não pode ser maior que a data de fim',
    })
    expect(result).toBe(response)
  })

  it('should pass from_date and to_date to the use case when both are valid', async () => {
    // arrange
    const { stub, getBalanceUserUseCaseStub } = makeSut()
    const from_date = '2026-06-01T00:00:00.000Z'
    const to_date = '2026-06-10T00:00:00.000Z'
    const httpRequest = makeHttpRequestById(
      { id: userFixture.id },
      { from_date, to_date },
    )
    const { response } = makeHttpResponse()

    // act
    const result = await stub.execute(httpRequest, response)

    // assert
    expect(getBalanceUserUseCaseStub.execute).toHaveBeenCalledWith({
      id: userFixture.id,
      from_date,
      to_date,
    })
    expect(response.status).toHaveBeenCalledWith(200)
    expect(result).toBe(response)
  })
})
