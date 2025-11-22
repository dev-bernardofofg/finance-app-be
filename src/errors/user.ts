export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`O email ${email} já está em uso.`)
    this.name = 'EmailAlreadyInUseError'
  }
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`Usuário com ID ${id} não encontrado.`)
    this.name = 'UserNotFoundError'
  }
}
