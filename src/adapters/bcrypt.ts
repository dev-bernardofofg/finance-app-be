import bcrypt from 'bcrypt'

export class PasswordHasherAdapter {
  async execute(password: string) {
    return bcrypt.hash(password, 10)
  }
}

export class PasswordComparerAdapter {
  async execute(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  }
}
