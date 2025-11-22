export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`O email ${email} já está em uso.`)
    this.name = 'EmailAlreadyInUseError'
  }
}
