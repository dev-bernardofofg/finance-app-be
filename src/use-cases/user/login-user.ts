import { PasswordComparerAdapter, TokenGeneratorAdapter } from '../../adapters'
import { EmailUserNotFoundError, InvalidPasswordError } from '../../errors/user'
import { IPostgresGetUserByEmailRepository } from '../../repositories/postgres'

export class LoginUserUseCase {
  private getUserByEmailRepository: IPostgresGetUserByEmailRepository
  private passwordComparerAdapter: PasswordComparerAdapter
  private tokenGeneratorAdapter: TokenGeneratorAdapter
  constructor(
    getUserByEmailRepository: IPostgresGetUserByEmailRepository,
    passwordComparerAdapter: PasswordComparerAdapter,
    tokenGeneratorAdapter: TokenGeneratorAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.passwordComparerAdapter = passwordComparerAdapter
    this.tokenGeneratorAdapter = tokenGeneratorAdapter
  }
  async execute(email: string, password: string) {
    const user = await this.getUserByEmailRepository.execute(email)

    if (!user) {
      throw new EmailUserNotFoundError(email)
    }

    const isPasswordValid = await this.passwordComparerAdapter.execute(
      password,
      user.password as string,
    )

    if (!isPasswordValid) {
      throw new InvalidPasswordError()
    }

    const tokens = await this.tokenGeneratorAdapter.execute(user.id)

    return {
      ...user,
      tokens,
    }
  }
}
