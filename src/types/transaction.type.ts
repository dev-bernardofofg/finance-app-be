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

export const createTransactionInputSchema = z.object({
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
  date: z.iso.datetime({ error: 'A data da transação é obrigatória' }),
})

export const transactionIdParamSchema = z.object({
  id: z
    .string({ error: 'O ID da transação é obrigatório' })
    .min(1, { error: 'O ID da transação é obrigatório' })
    .uuid({ error: 'O ID da transação deve ser um UUID válido' }),
})

export type CreateTransactionInput = z.infer<
  typeof createTransactionInputSchema
>

export const updateTransactionSchema = z.strictObject(
  createTransactionInputSchema.partial().shape,
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

export const getTransactionsByUserIdParamsSchema = z.object({
  user_id: z
    .string({ error: 'O campo user_id é obrigatório' })
    .min(1, { error: 'O campo user_id é obrigatório' })
    .uuid({ error: 'O campo user_id deve ser um UUID válido' }),
})

export const getTransactionsByUserIdQuerySchema = z
  .object({
    from_date: z.iso
      .datetime({ error: 'A data de início deve ser uma data válida' })
      .optional(),
    to_date: z.iso
      .datetime({ error: 'A data de fim deve ser uma data válida' })
      .optional(),
  })
  .refine((data) => !(data.from_date && !data.to_date), {
    error: 'A data de fim é obrigatória quando a data de início é informada',
    path: ['to_date'],
  })
  .refine((data) => !(data.to_date && !data.from_date), {
    error: 'A data de início é obrigatória quando a data de fim é informada',
    path: ['from_date'],
  })
  .refine(
    (data) =>
      !(data.from_date && data.to_date) ||
      new Date(data.from_date) <= new Date(data.to_date),
    {
      error: 'A data de início não pode ser maior que a data de fim',
      path: ['from_date'],
    },
  )
