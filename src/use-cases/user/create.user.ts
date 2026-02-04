import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { EmailAlreadyInUseError } from '../../errors/user'
import { IPostgresCreateUserRepository } from '../../repositories/postgres'
import { UserResponse } from '../../types/user'

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
    // Verificar se o usuário já existe
    const user = await this.createUserRepository.findByEmail(
      createUserParams.email,
    )
    if (user) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }
    // Gerar ID do usuário
    const userId = uuidv4()
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)
    // Salvar o usuário no banco de dados
    const payload = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }
    try {
      return await this.createUserRepository.execute(payload)
    } catch (error) {
      throw new Error('Erro ao criar usuário')
    }
  }
}
