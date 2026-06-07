import { NextFunction, Request } from 'express'
import jwt from 'jsonwebtoken'
import { authMiddleware } from './auth'
import { makeHttpResponse } from '@/helpers/test'

describe('authMiddleware', () => {
  const makeSut = () => ({ sut: authMiddleware })

  const makeHttpRequest = (authorization?: string) =>
    ({ headers: { authorization } }) as Request

  const makeNext = () => jest.fn() as unknown as NextFunction

  it('should return 401 when authorization header is missing', () => {
    const { sut } = makeSut()
    const request = makeHttpRequest(undefined)
    const { response } = makeHttpResponse()

    sut(request, response as never, makeNext())

    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Token de acesso não fornecido',
    })
  })

  it('should return 401 when scheme is not Bearer', () => {
    const { sut } = makeSut()
    const request = makeHttpRequest('Basic some-token')
    const { response } = makeHttpResponse()

    sut(request, response as never, makeNext())

    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Token de acesso não fornecido',
    })
  })

  it('should return 401 when token is missing after Bearer scheme', () => {
    const { sut } = makeSut()
    const request = makeHttpRequest('Bearer')
    const { response } = makeHttpResponse()

    sut(request, response as never, makeNext())

    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Token de acesso não fornecido',
    })
  })

  it('should return 401 when decoded token has no user_id', () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => ({}) as never)
    const request = makeHttpRequest('Bearer valid-token')
    const { response } = makeHttpResponse()

    sut(request, response as never, makeNext())

    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Token de acesso inválido',
    })
  })

  it('should return 401 with the error message when jwt.verify throws an Error', () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error('jwt expired')
    })
    const request = makeHttpRequest('Bearer expired-token')
    const { response } = makeHttpResponse()

    sut(request, response as never, makeNext())

    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({ message: 'jwt expired' })
  })

  it('should return 401 with fallback message when jwt.verify throws a non-Error', () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw 'string error'
    })
    const request = makeHttpRequest('Bearer bad-token')
    const { response } = makeHttpResponse()

    sut(request, response as never, makeNext())

    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({ message: 'Token inválido' })
  })

  it('should set req.user_id and call next when token is valid', () => {
    const { sut } = makeSut()
    jest
      .spyOn(jwt, 'verify')
      .mockImplementationOnce(() => ({ user_id: 'user-id' }) as never)
    const request = makeHttpRequest('Bearer valid-token')
    const { response } = makeHttpResponse()
    const next = makeNext()

    sut(request, response as never, next)

    expect(request.user_id).toBe('user-id')
    expect(next).toHaveBeenCalledTimes(1)
    expect(response.status).not.toHaveBeenCalled()
  })
})
