import { Request } from 'express'
import { makeHttpResponse } from '../../helpers/test'
import { transactionFixture } from '../../test/fixtures/transaction'
import { ITransactionResponse } from '../../types'
import { UpdateTransactionController } from './update.transaction'

describe('UpdateTransactionController', () => {
  const updateBody = {
    name: transactionFixture.name,
    type: transactionFixture.type,
    amount: transactionFixture.amount,
    date: transactionFixture.date,
  }

  class UpdateTransactionUseCaseStub {
    execute = jest.fn(
      async (): Promise<ITransactionResponse> => transactionFixture,
    )
  }

  const makeSut = () => {
    const updateTransactionUseCaseStub = new UpdateTransactionUseCaseStub()
    const sut = new UpdateTransactionController(updateTransactionUseCaseStub)
    return { sut, updateTransactionUseCaseStub }
  }

  const makeHttpRequest = (params?: { id: string }) =>
    ({
      params: { id: params?.id ?? transactionFixture.id },
      body: updateBody,
    }) as Pick<Request, 'params' | 'body'>

  it('should return 200 when the transaction is updated successfully', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ...transactionFixture,
      }),
    )
    expect(result).toBe(response)
  })

  it('should return 400 when the transaction id is invalid', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ id: 'invalid-id' })
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
    const httpRequest = {
      params: { id: transactionFixture.id },
      body: { ...updateBody, amount: 0 },
    } as Pick<Request, 'params' | 'body'>
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
      params: { id: transactionFixture.id },
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
    const httpRequest = {
      params: { id: transactionFixture.id },
      body: { ...updateBody, unallowed_field: '123' },
    } as Pick<Request, 'params' | 'body'>
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
