import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user'
import { makeHttpRequestById } from '../../helpers/test'
import { UserResponse } from '../../types'
import { HttpResponse, responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'
import { DeleteUserController } from './delete-user'

describe('DeleteUserController', () => {
  class DeleteUserUseCaseStub {
    execute = jest.fn(
      async (userId: string): Promise<UserResponse> => ({
        id: userId,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
      }),
    )
  }

  const makeSut = () => {
    const deleteUserUseCaseStub = new DeleteUserUseCaseStub()
    const sut = new DeleteUserController(deleteUserUseCaseStub)
    return { sut, deleteUserUseCaseStub }
  }

  const makeHttpResponse = () => {
    const status = jest.fn().mockReturnThis()
    const json = jest.fn().mockReturnThis()
    const response: HttpResponse = { status, json }

    return { response }
  }

  it('should return 200 when user is deleted successfully', async () => {
    // arranged
    const { sut, deleteUserUseCaseStub } = makeSut()
    const userId = faker.string.uuid()
    const httpRequest = makeHttpRequestById({ id: userId })
    const { response } = makeHttpResponse()
    // act
    const result = await sut.execute(httpRequest, response)
    // assert
    expect(deleteUserUseCaseStub.execute).toHaveBeenCalledWith(userId)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: userId }),
    )
    expect(result).toBe(response)
  })

  it('should return 400 when the user id is invalid', async () => {
    // arranged
    const { sut, deleteUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById({ id: 'id-invalido' })
    const { response } = makeHttpResponse()
    jest
      .spyOn(validatorHelpers, 'idIsValid')
      .mockReturnValueOnce(
        responseHelper.badRequest(
          response,
          'O ID não é válido. Por favor, informe um ID válido.',
        ),
      )
    // act
    const result = await sut.execute(httpRequest, response)
    // assert
    expect(deleteUserUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'O ID não é válido. Por favor, informe um ID válido.',
      }),
    )
    expect(result).toBe(response)
  })

  it('should return 404 when user is not found', async () => {
    // arranged
    const { sut, deleteUserUseCaseStub } = makeSut()
    const userId = faker.string.uuid()
    const httpRequest = makeHttpRequestById({ id: userId })
    const { response } = makeHttpResponse()
    // act
    deleteUserUseCaseStub.execute.mockRejectedValueOnce(
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
    // arranged
    const { sut, deleteUserUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequestById()
    const { response } = makeHttpResponse()

    deleteUserUseCaseStub.execute.mockRejectedValueOnce(new Error())
    // act
    const result = await sut.execute(httpRequest, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao deletar usuário',
    })
    expect(result).toBe(response)
  })
})
