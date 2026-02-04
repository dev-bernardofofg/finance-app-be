export type UserResponse = {
  id: string
  first_name: string
  last_name: string
  email: string
}

export interface ICreateUserParams {
  id?: string
  first_name: string
  last_name: string
  email: string
  password: string
}
