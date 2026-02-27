import z from 'zod'

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

export const createUserSchema = z.object({
  first_name: z.string().min(1, 'O nome é obrigatório'),
  last_name: z.string().min(1, 'O sobrenome é obrigatório'),
  email: z.string().email('O email não é válido'),
  password: z
    .string()
    .trim()
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUserParams = z.infer<typeof createUserSchema>
export type UpdateUserParams = z.infer<typeof updateUserSchema>
