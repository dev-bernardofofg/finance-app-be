import { IdGeneratorAdapter, TokenGeneratorAdapter } from '@/adapters'
import { PasswordHasherAdapter } from '@/adapters/bcrypt'
import { EmailAlreadyInUseError } from '@/errors/user'
import {
  IPostgresCreateUserRepository,
  IPostgresGetUserByEmailRepository,
} from '@/repositories/postgres'
import { UserResponse } from '@/types'

interface CreateUserParams {
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface ICreateUserUseCase {
  execute(createUserParams: CreateUserParams): Promise<UserResponse>
}

export class CreateUserUseCase implements ICreateUserUseCase {
  private createUserRepository: IPostgresCreateUserRepository
  private getUserByEmailRepository: IPostgresGetUserByEmailRepository
  private passwordHasherAdapter: PasswordHasherAdapter
  private idGeneratorAdapter: IdGeneratorAdapter
  private tokenGeneratorAdapter: TokenGeneratorAdapter
  constructor(
    createUserRepository: IPostgresCreateUserRepository,
    getUserByEmailRepository: IPostgresGetUserByEmailRepository,
    passwordHasherAdapter: PasswordHasherAdapter,
    idGeneratorAdapter: IdGeneratorAdapter,
    tokenGeneratorAdapter: TokenGeneratorAdapter,
  ) {
    this.createUserRepository = createUserRepository
    this.getUserByEmailRepository = getUserByEmailRepository
    this.passwordHasherAdapter = passwordHasherAdapter
    this.idGeneratorAdapter = idGeneratorAdapter
    this.tokenGeneratorAdapter = tokenGeneratorAdapter
  }

  async execute(createUserParams: CreateUserParams) {
    const user = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    )
    if (user) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }
    const userId = await this.idGeneratorAdapter.execute()
    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    )

    const { access_token, refresh_token } =
      await this.tokenGeneratorAdapter.execute(userId)

    const createdUser = await this.createUserRepository.execute({
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    })

    return {
      ...createdUser,
      password: hashedPassword,
      tokens: {
        access_token,
        refresh_token,
      },
    }
  }
}
