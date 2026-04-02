import bcrypt from 'bcrypt'

export class PasswordHasherAdapter {
  async execute(password: string) {
    return bcrypt.hash(password, 10)
  }
}
