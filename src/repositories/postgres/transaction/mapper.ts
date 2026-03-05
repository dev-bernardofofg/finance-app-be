import { toNumberFromDatabase } from '../../../helpers/money'
import { ITransactionResponse } from '../../../types'

type TransactionRow = Omit<ITransactionResponse, 'amount'> & {
  amount: unknown
}

export const mapTransactionFromDatabase = (
  transaction: TransactionRow,
): ITransactionResponse => {
  return {
    ...transaction,
    amount: toNumberFromDatabase(transaction.amount),
  }
}
