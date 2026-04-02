import { makeHttpResponse } from '../../helpers/test'
import { responseHelper } from './http'

describe('responseHelper', () => {
  it('should return 200 with data', () => {
    const { response } = makeHttpResponse()
    responseHelper.ok(response, { message: 'Hello, world!' })
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.json).toHaveBeenCalledWith({ message: 'Hello, world!' })
  })

  it('should return 201 with data', () => {
    const { response } = makeHttpResponse()
    responseHelper.created(response, { message: 'Created' })
    expect(response.status).toHaveBeenCalledWith(201)
    expect(response.json).toHaveBeenCalledWith({ message: 'Created' })
  })

  it('should return 400 with message', () => {
    const { response } = makeHttpResponse()
    responseHelper.badRequest(response, 'Bad request')
    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({ message: 'Bad request' })
  })

  it('should return 401 with message', () => {
    const { response } = makeHttpResponse()
    responseHelper.unauthorized(response, 'Unauthorized')
    expect(response.status).toHaveBeenCalledWith(401)
    expect(response.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })

  it('should return 403 with message', () => {
    const { response } = makeHttpResponse()
    responseHelper.forbidden(response, 'Forbidden')
    expect(response.status).toHaveBeenCalledWith(403)
    expect(response.json).toHaveBeenCalledWith({ message: 'Forbidden' })
  })

  it('should return 404 with message', () => {
    const { response } = makeHttpResponse()
    responseHelper.notFound(response, 'Not found')
    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({ message: 'Not found' })
  })

  it('should return 409 with message', () => {
    const { response } = makeHttpResponse()
    responseHelper.conflict(response, 'Conflict')
    expect(response.status).toHaveBeenCalledWith(409)
    expect(response.json).toHaveBeenCalledWith({ message: 'Conflict' })
  })

  it('should return 500 with message', () => {
    const { response } = makeHttpResponse()
    responseHelper.internalServerError(response, 'Internal server error')
    expect(response.status).toHaveBeenCalledWith(500)
    expect(response.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    })
  })
})
