export class TransactionNotFoundError extends Error {
  constructor(id: string) {
    super(`Transação com ID ${id} não encontrada.`)
    this.name = 'TransactionNotFoundError'
  }
}
