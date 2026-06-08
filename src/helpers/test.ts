import { faker } from '@faker-js/faker'
import { Request } from 'express'
import { HttpResponse } from '@/controllers/helpers/http'

export const makeHttpResponse = () => {
  const status = jest.fn().mockReturnThis()
  const json = jest.fn().mockReturnThis()
  const response: HttpResponse = { status, json }

  return { response }
}

export const makeHttpRequestById = (
  params?: {
    id?: string
  },
  query?: Record<string, string>,
): Pick<Request, 'params' | 'query'> => ({
  params: {
    id: faker.string.uuid(),
    ...params,
  } as Record<string, string>,
  query: query ?? {},
})
