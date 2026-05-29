export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`O email ${email} já está em uso.`)
    this.name = 'EmailAlreadyInUseError'
  }
}

export class UserNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Usuário com ID ${identifier} não encontrado.`)
    this.name = 'UserNotFoundError'
  }
}

export class EmailUserNotFoundError extends Error {
  constructor(email: string) {
    super(`Usuário com email ${email} não encontrado.`)
    this.name = 'EmailUserNotFoundError'
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super('Senha inválida.')
    this.name = 'InvalidPasswordError'
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Credenciais inválidas.')
    this.name = 'InvalidCredentialsError'
  }
}
