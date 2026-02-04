export interface ICreateTransactionParams {
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
