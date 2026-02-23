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
      SELECT
	      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
	      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
	      SUM(CASE WHEN type = 'investment' THEN amount ELSE 0 END) AS total_investments,
		      (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)
		        -
		      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)
		        -
		      SUM(CASE WHEN type = 'investment' THEN amount ELSE 0 END)
		      ) AS balance
      FROM transactions
      WHERE user_id = $1
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
