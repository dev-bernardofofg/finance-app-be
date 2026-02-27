import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { EmailAlreadyInUseError } from '../../errors/user'
import { IPostgresCreateUserRepository } from '../../repositories/postgres'
import { UserResponse } from '../../types/user.type'

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

  constructor(createUserRepository: IPostgresCreateUserRepository) {
    this.createUserRepository = createUserRepository
  }

  async execute(createUserParams: CreateUserParams) {
    const user = await this.createUserRepository.findByEmail(
      createUserParams.email,
    )
    if (user) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }
    const userId = uuidv4()
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)
    const payload = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }
    return this.createUserRepository.execute(payload)
  }
}
