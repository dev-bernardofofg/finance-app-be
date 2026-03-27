import { HttpResponse } from '../controllers/helpers/http'

export const makeHttpResponse = () => {
  const status = jest.fn().mockReturnThis()
  const json = jest.fn().mockReturnThis()
  const response: HttpResponse = { status, json }

  return { response }
}
