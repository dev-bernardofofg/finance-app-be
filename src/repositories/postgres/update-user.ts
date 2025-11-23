import { PostgresHelper } from '../../db/postgres/helper'

export interface UpdateUserParams {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  password?: string
}

export type UserFields = Omit<UpdateUserParams, 'id'>

export const PostgresUpdateUserRepository = {
  execute: async (userId: string, updateUserParams: UserFields) => {
    const updatedFields = []
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
    RETURNING *
    `

    const updatedUser = await PostgresHelper.query(query, updateValues)

    return updatedUser
  },
}
