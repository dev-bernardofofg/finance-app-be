import { PostgresHelper } from '../../../db/postgres/helper'

export interface GetBalanceUserParams {
  id: string
}

export interface GetBalanceUserResponse {
  total_income: number
  total_expenses: number
  total_investments: number
  balance: number
}

export interface IGetBalanceUserRepository {
  execute(params: GetBalanceUserParams): Promise<GetBalanceUserResponse>
}

export class PostgresGetBalanceUserRepository implements IGetBalanceUserRepository {
  async execute(params: GetBalanceUserParams): Promise<GetBalanceUserResponse> {
    const query = `
      SELECT * FROM get_user_balance($1)
    `
    const balance = await PostgresHelper.query<GetBalanceUserResponse>(query, [
      params.id,
    ])
    return {
      ...balance[0],
      userId: params.id,
    }
  }
}
