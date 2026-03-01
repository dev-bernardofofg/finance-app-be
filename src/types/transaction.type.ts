import validator from 'validator'
import z from 'zod'

export interface ITransactionParams {
  id?: string
  user_id: string
  name: string
  type: 'income' | 'expense' | 'investment'
  amount: number
  date: Date
}

export interface ITransactionResponse {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense' | 'investment'
  amount: number
  date: Date
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
  type: z.enum(['income', 'expense', 'investment'], {
    error: 'O tipo de transação deve ser "income", "expense" ou "investment"',
  }),
  amount: z
    .number({
      error: 'O valor da transação é obrigatório e deve ser um número',
    })
    .min(1, {
      error: 'O valor da transação deve ser maior que 0',
    })
    .refine(
      (value) =>
        validator.isCurrency(value.toFixed(2), {
          digits_after_decimal: [2],
          allow_negatives: false,
          decimal_separator: '.',
        }),
      { error: 'O valor da transação deve ser um valor monetário válido' },
    ),
  date: z
    .string({ error: 'A data da transação é obrigatória' })
    .datetime()
    .min(1, {
      error: 'A data da transação é obrigatória',
    }),
})

export type CreateTransactionParams = z.infer<typeof createTransactionSchema>

export const updateTransactionSchema = createTransactionSchema.partial()
export type UpdateTransactionParams = z.infer<typeof updateTransactionSchema>
