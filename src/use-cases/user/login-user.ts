import { PasswordComparerAdapter, TokenGeneratorAdapter } from '@/adapters'
import { InvalidCredentialsError } from '@/errors/user'
import { IPostgresGetUserByEmailRepository } from '@/repositories/postgres'
import { UserResponse } from '@/types'

export interface ILoginUserUseCase {
  execute(
    email: string,
    password: string,
  ): Promise<
    Omit<UserResponse, 'password'> & {
      tokens: { access_token: string; refresh_token: string }
    }
  >
}

export class LoginUserUseCase implements ILoginUserUseCase {
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
      throw new InvalidCredentialsError()
    }

    const isPasswordValid = await this.passwordComparerAdapter.execute(
      password,
      user.password as string,
    )

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    const tokens = await this.tokenGeneratorAdapter.execute(user.id)

    const { password: _, ...userWithoutPassword } = user

    return {
      ...userWithoutPassword,
      tokens,
    }
  }
}
