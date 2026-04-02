import { v4 as uuidv4 } from 'uuid'
import { PasswordHasherAdapter } from '../../adapters/bcrypt'
import { EmailAlreadyInUseError } from '../../errors/user'
import {
  IPostgresCreateUserRepository,
  IPostgresGetUserByEmailRepository,
} from '../../repositories/postgres'
import { UserResponse } from '../../types'

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
  constructor(
    createUserRepository: IPostgresCreateUserRepository,
    getUserByEmailRepository: IPostgresGetUserByEmailRepository,
    passwordHasherAdapter: PasswordHasherAdapter,
  ) {
    this.createUserRepository = createUserRepository
    this.getUserByEmailRepository = getUserByEmailRepository
    this.passwordHasherAdapter = passwordHasherAdapter
  }

  async execute(createUserParams: CreateUserParams) {
    const user = await this.getUserByEmailRepository.execute({
      email: createUserParams.email,
    })
    if (user) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }
    const userId = uuidv4()
    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    )
    const payload = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }
    return this.createUserRepository.execute(payload)
  }
}
