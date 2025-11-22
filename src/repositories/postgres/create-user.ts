import { PostgresHelper } from '../../db/postgres/helper'

export interface CreateUserParams {
  id?: string
  first_name: string
  last_name: string
  email: string
  password: string
}

export const PostgresCreateUserRepository = {
  execute: async (createUserParams: CreateUserParams) => {
    await PostgresHelper.query(
      'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
      [
        createUserParams.id,
        createUserParams.first_name,
        createUserParams.last_name,
        createUserParams.email,
        createUserParams.password,
      ],
    )
    const createdUser = await PostgresHelper.query(
      'SELECT * FROM users WHERE id = $1',
      [createUserParams.id],
    )

    return createdUser as CreateUserParams
  },
}
