import { faker } from '@faker-js/faker'
import { Request, Response } from 'express'
import { UserNotFoundError } from '../../errors/user'
import { makeHttpRequestById, makeHttpResponse } from '../../helpers/test'
import { GetUserByIdParams } from '../../repositories/postgres'
import { UserResponse } from '../../types'
import { responseHelper } from '../helpers/http'
import { validatorHelpers } from '../helpers/validator'
import { GetUserByIdController } from './get-user-by-id'

describe('GetUserByIdController', () => {
  class GetUserByIdUseCaseStub {
    execute = jest.fn(
      async (params: GetUserByIdParams): Promise<UserResponse> => ({
        id: params.id,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
      }),
    )
  }

  const makeSut = () => {
    const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub()
    const sut = new GetUserByIdController(getUserByIdUseCaseStub)
    return { sut, getUserByIdUseCaseStub }
  }

  const makeHttpRequest = () => ({
    params: { id: faker.string.uuid() },
  })

  it('should return 200 when getting user by id', async () => {
    // arrange
    const { sut, getUserByIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(httpRequest, response as Response)

    // assert
    expect(getUserByIdUseCaseStub.execute).toHaveBeenCalledWith({
      id: httpRequest.params.id,
    })
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: httpRequest.params.id }),
    )
    expect(result).toBe(response)
  })

  it('should return 400 when the user id is invalid', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut()
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

    const result = await sut.execute(
      httpRequest as Request,
      response as Response,
    )

    expect(getUserByIdUseCaseStub.execute).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'O ID não é válido. Por favor, informe um ID válido.',
      }),
    )
    expect(result).toBe(response)
  })

  it('should return 404 when user is not found', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    getUserByIdUseCaseStub.execute.mockRejectedValueOnce(
      new UserNotFoundError(httpRequest.params.id),
    )

    const result = await sut.execute(httpRequest, response as Response)

    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      message: `Usuário com ID ${httpRequest.params.id} não encontrado.`,
    })
    expect(result).toBe(response)
  })

  it('should return 500 when an unexpected error occurs', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()

    getUserByIdUseCaseStub.execute.mockRejectedValueOnce(new Error())

    const result = await sut.execute(httpRequest, response as Response)

    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao buscar usuário',
    })
    expect(result).toBe(response)
  })

  it('should call GetUserByIdUseCase with the correct parameters', async () => {
    // arrange
    const { sut, getUserByIdUseCaseStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const { response } = makeHttpResponse()
    const executeSpy = jest.spyOn(getUserByIdUseCaseStub, 'execute')

    // act
    await sut.execute(httpRequest, response)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({ id: httpRequest.params.id })
  })
})
