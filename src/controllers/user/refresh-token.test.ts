import { makeHttpResponse } from '@/helpers/test'
import { RefreshTokenController } from './refresh-token'
import { Request } from 'express'
import { UnauthorizedError } from '@/errors/user'

describe('RefreshTokenController', () => {
  class RefreshTokenUseCaseStub {
    execute = jest.fn(
      async (): Promise<{ access_token: string; refresh_token: string }> => ({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      }),
    )
  }

  const makeSut = () => {
    const refreshTokenUseCaseStub = new RefreshTokenUseCaseStub()
    const sut = new RefreshTokenController(refreshTokenUseCaseStub)
    return { sut, refreshTokenUseCaseStub }
  }

  const httpRequest = (requestData: unknown) => {
    return {
      body: {
        refreshToken: requestData,
      },
    } as Request
  }

  it('should return 200 if refresh token is valid', async () => {
    // arrange
    const { sut } = makeSut()
    const request = httpRequest('refresh-token')
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(request, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    })
    expect(result).toBe(response)
  })

  it('should return 401 if unathorized error occurs', async () => {
    // arrange
    const { sut, refreshTokenUseCaseStub } = makeSut()
    const request = httpRequest('refresh-token')
    const { response } = makeHttpResponse()
    jest
      .spyOn(refreshTokenUseCaseStub, 'execute')
      .mockRejectedValueOnce(new UnauthorizedError())

    // act
    const result = await sut.execute(request, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Não autorizado.',
    })
    expect(result).toBe(response)
  })

  it('should return 500 if an unexpected error occurs', async () => {
    // arrange
    const { sut, refreshTokenUseCaseStub } = makeSut()
    const request = httpRequest('refresh-token')
    const { response } = makeHttpResponse()
    jest
      .spyOn(refreshTokenUseCaseStub, 'execute')
      .mockRejectedValueOnce(new Error())

    // act
    const result = await sut.execute(request, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Erro ao atualizar token',
    })
    expect(result).toBe(response)
  })
  it('should return 400 if refresh token is invalid', async () => {
    // arrange
    const { sut } = makeSut()
    const request = httpRequest(2)
    const { response } = makeHttpResponse()

    // act
    const result = await sut.execute(request, response)

    // assert
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      message: 'O refresh token é obrigatório',
    })
    expect(result).toBe(response)
  })
})
