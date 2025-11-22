import { Request, Response } from 'express'
import validator from 'validator'
import { EmailAlreadyInUseError } from '../errors/user'
import { CreateUserParams } from '../repositories/postgres/create-user'
import { CreateUserUseCase } from '../use-cases/create-user'
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
    const emailIsValid = validator.isEmail(params.email ?? '')
    const passwordIsValid = validator.isStrongPassword(params.password ?? '', {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })

    for (const field of requiredFields) {
      if (!params?.[field] || String(params[field]).trim().length === 0) {
        // Verifica se o campo é obrigatório e se está vazio
        return responseHelper.badRequest(res, `O campo ${field} é obrigatório`)
      }
    }

    if (!passwordIsValid) {
      return responseHelper.badRequest(
        res,
        'A senha deve ter pelo menos 6 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo.',
      )
    }

    if (!emailIsValid) {
      return responseHelper.badRequest(
        res,
        'O email não é válido. Por favor, informe um email válido.',
      )
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
