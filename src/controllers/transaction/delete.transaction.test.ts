import { makeHttpRequestById, makeHttpResponse } from '../../helpers/test'
import { transactionFixture } from '../../test/fixtures/transaction'
import { ITransactionResponse } from '../../types'
import { DeleteTransactionController } from './delete.transaction'

describe('DeleteTransactionController', () => {
  class DeleteTransactionUseCaseStub {
    execute = jest.fn(
      async (_transactionId: string): Promise<ITransactionResponse> =>
        transactionFixture,
    )
  }

  const makeSut = () => {
    const deleteTransactionUseCaseStub = new DeleteTransactionUseCaseStub()
    const sut = new DeleteTransactionController(deleteTransactionUseCaseStub)
    return { sut, deleteTransactionUseCaseStub }
  }

  it('should return 200 when the transaction is deleted successfully', async () => {
    // arrange
    const { sut } = makeSut()
    const httpRequest = makeHttpRequestById({ id: transactionFixture.id })
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
    const { sut, deleteTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: transactionFixture.id })
    const { response } = makeHttpResponse()
    deleteTransactionUseCaseStub.execute.mockResolvedValueOnce(null as never)

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
    const { sut, deleteTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: transactionFixture.id })
    const { response } = makeHttpResponse()
    deleteTransactionUseCaseStub.execute.mockRejectedValueOnce(new Error())

    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao deletar transação',
    })
    expect(result).toBe(response)
  })

  it('should call DeleteTransactionUseCase with the correct parameters', async () => {
    // arrange
    const { sut, deleteTransactionUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: transactionFixture.id })
    const { response } = makeHttpResponse()
    const executeSpy = jest.spyOn(deleteTransactionUseCaseStub, 'execute')

    // act
    await sut.execute(httpRequest, response)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.id)
  })
})
