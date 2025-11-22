import { Request, Response } from 'express'
import validator from 'validator'
import { CreateUserParams } from '../repositories/postgres/create-user'
import { CreateUserUseCase } from '../use-cases/create-user'

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
        return res.status(400).json({
          message: `O campo ${field} é obrigatório`,
        })
      }
    }

    if (!passwordIsValid) {
      return res.status(400).json({
        message:
          'A senha deve ter pelo menos 6 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo.',
      })
    }

    if (!emailIsValid) {
      return res.status(400).json({
        message: 'O email não é válido. Por favor, informe um email válido.',
      })
    }

    // Executar o use case
    try {
      const user = await CreateUserUseCase.execute(params as CreateUserParams)
      return res.status(201).json(user)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)

      // Verifica se é um erro conhecido (ex: email duplicado)
      if (error instanceof Error && error.message === 'Email já cadastrado') {
        return res.status(409).json({ message: error.message })
      }

      return res.status(500).json({ message: 'Erro ao criar usuário' })
    }
  },
}
