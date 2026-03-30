import { faker } from '@faker-js/faker'
import { Request, Response } from 'express'
import { makeHttpRequestById, makeHttpResponse } from '../../helpers/test'
import { GetBalanceUserResponse } from '../../repositories/postgres/user/get-balance.user'
import { GetBalanceUserController } from './get-balance.user'
describe('GetBalanceUserController', () => {
  class GetBalanceUserUseCaseStub {
    execute = jest.fn(
      async (_id: string): Promise<GetBalanceUserResponse> => ({
        total_income: faker.number.int(),
        total_expenses: faker.number.int(),
        total_investments: faker.number.int(),
        balance: faker.number.int(),
      }),
    )
  }

  const makeSut = () => {
    const getBalanceUserUseCaseStub = new GetBalanceUserUseCaseStub()
    const getBalanceUserController = new GetBalanceUserController(
      getBalanceUserUseCaseStub,
    )
    return { getBalanceUserController, getBalanceUserUseCaseStub }
  }

  it('should return 200 when getting user balance', async () => {
    const { getBalanceUserController, getBalanceUserUseCaseStub } = makeSut()
    const userId = faker.string.uuid()
    const httpRequest = makeHttpRequestById({ id: userId })
    const { response } = makeHttpResponse()

    const result = await getBalanceUserController.execute(
      httpRequest as Request,
      response as Response,
    )

    expect(getBalanceUserUseCaseStub.execute).toHaveBeenCalledWith(userId)
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
})
