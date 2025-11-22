import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { EmailAlreadyInUseError } from '../errors/user'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email'

interface CreateUserParams {
  first_name: string
  last_name: string
  email: string
  password: string
}

export const CreateUserUseCase = {
  execute: async (createUserParams: CreateUserParams) => {
    // TODO: Verificar se o usuário já existe
    const user = await PostgresGetUserByEmailRepository.execute({
      email: createUserParams.email,
    })
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
      return await PostgresCreateUserRepository.execute(payload)
    } catch (error) {
      throw new Error('Erro ao criar usuário')
    }
  },
}
