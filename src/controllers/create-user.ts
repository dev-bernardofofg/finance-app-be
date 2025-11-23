import { Request, Response } from 'express'
import { EmailAlreadyInUseError } from '../errors/user'
import { CreateUserParams } from '../repositories/postgres/create-user'
import { CreateUserUseCase } from '../use-cases/create-user'
import { validatorHelpers } from '../utils/validators'
import { responseHelper } from './helpers'

export const CreateUserController = {
  execute: async (req: Request, res: Response) => {
    // Validar os dados da requisição
    const params = req.body as Partial<CreateUserParams>
    const requiredFields: (keyof CreateUserParams)[] = [
      'first_name',
      'last_name',
      'email',
      'password',
    ]
    validatorHelpers.emailIsValid(params.email ?? '', res)
    validatorHelpers.passwordIsValid(params.password ?? '', res)

    for (const field of requiredFields) {
      if (!params?.[field] || String(params[field]).trim().length === 0) {
        // Verifica se o campo é obrigatório e se está vazio
        return responseHelper.badRequest(res, `O campo ${field} é obrigatório`)
      }
    }

    // Executar o use case
    try {
      const user = await CreateUserUseCase.execute(params as CreateUserParams)
      return responseHelper.created(res, user)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)

      // Verifica se é um erro conhecido (ex: email duplicado)
      if (error instanceof EmailAlreadyInUseError) {
        return responseHelper.badRequest(res, error.message)
      }

      return responseHelper.internalServerError(res, 'Erro ao criar usuário')
    }
  },
}
