import { PostgresHelper } from '../../../db/postgres/helper'
import { UserResponse } from '../../../types/user.type'

export interface UpdateUserParams {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  password?: string
}

export type UserFields = Omit<UpdateUserParams, 'id'>

export interface IPostgresUpdateUserRepository {
  execute(
    userId: string,
    updateUserParams: UserFields,
  ): Promise<UserResponse | null>
}

export class PostgresUpdateUserRepository implements IPostgresUpdateUserRepository {
  async execute(
    userId: string,
    updateUserParams: UserFields,
  ): Promise<UserResponse | null> {
    const updatedFields: string[] = []
    const updateValues: string[] = []

    Object.keys(updateUserParams).forEach((key) => {
      updatedFields.push(
        `${key as keyof UpdateUserParams} = $${
          updateValues.length + 1
        }` as never,
      )
      updateValues.push(
        updateUserParams[key as keyof UpdateUserParams] as never,
      )
    })

    updateValues.push(userId)

    const query = `
    UPDATE users 
    SET ${updatedFields.join(', ')} 
    WHERE id = $${updateValues.length}
    RETURNING id, first_name, last_name, email
    `

    const updatedUser = await PostgresHelper.query<UserResponse[]>(
      query,
      updateValues,
    )

    return updatedUser[0] ?? null
  }
}
