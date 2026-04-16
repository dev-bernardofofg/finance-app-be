import z from 'zod'

export interface ITransactionParams {
  id?: string
  user_id: string
  name: string
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT'
  amount: number
  date: string
}

export interface ITransactionResponse {
  id: string
  user_id: string
  name: string
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT'
  amount: number
  date: string | Date
}

export const createTransactionSchema = z.object({
  user_id: z
    .string({ error: 'O ID do usuário é obrigatório' })
    .min(1, {
      error: 'O ID do usuário é obrigatório',
    })
    .uuid({
      error: 'O ID do usuário deve ser um UUID válido',
    }),
  name: z
    .string({ error: 'O nome da transação é obrigatório' })
    .min(1, {
      error: 'O nome da transação é obrigatório',
    })
    .trim(),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT'], {
    error: 'O tipo de transação deve ser "INCOME", "EXPENSE" ou "INVESTMENT"',
  }),
  amount: z
    .number({
      error: 'O valor da transação é obrigatório e deve ser um número',
    })
    .int({
      error: 'O valor da transação deve ser informado em centavos (inteiro)',
    })
    .min(1, {
      error: 'O valor da transação em centavos deve ser maior que 0',
    }),
  date: z
    .string({ error: 'A data da transação é obrigatória' })
    .datetime()
    .min(1, {
      error: 'A data da transação é obrigatória',
    }),
})

export const transactionIdParamSchema = z.object({
  id: z
    .string({ error: 'O ID da transação é obrigatório' })
    .min(1, { error: 'O ID da transação é obrigatório' })
    .uuid({ error: 'O ID da transação deve ser um UUID válido' }),
})

export type CreateTransactionParams = z.infer<typeof createTransactionSchema>

export const updateTransactionSchema = z.strictObject(
  createTransactionSchema.omit({ user_id: true }).partial().shape,
  {
    error: (issue) => {
      if (issue.code === 'unrecognized_keys') {
        return `Campos inválidos: ${issue.keys.join(', ')}`
      }
      return undefined
    },
  },
)

export type UpdateTransactionParams = z.infer<typeof updateTransactionSchema>

export const getTransactionsByUserIdQuerySchema = z.object({
  userId: z
    .string({ error: 'O campo userId é obrigatório' })
    .min(1, { error: 'O campo userId é obrigatório' })
    .uuid({ error: 'O campo userId deve ser um UUID válido' }),
})
