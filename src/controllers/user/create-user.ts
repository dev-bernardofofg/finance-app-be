import { Request } from 'express'
import { ZodError } from 'zod'
import { EmailAlreadyInUseError } from '../../errors/user'
import { createUserSchema } from '../../types'
import { ICreateUserUseCase } from '../../use-cases/user'
import { HttpResponse, responseHelper } from '../helpers/http'

export class CreateUserController {
  private createUserUseCase: ICreateUserUseCase
  constructor(createUserUseCase: ICreateUserUseCase) {
    this.createUserUseCase = createUserUseCase
  }

  async execute(req: Request, res: HttpResponse) {
    try {
      const params = await createUserSchema.parseAsync(req.body)
      const user = await this.createUserUseCase.execute(params)
      return responseHelper.created(res, user)
    } catch (error) {
      if (error instanceof ZodError) {
        return responseHelper.badRequest(res, error.issues[0].message)
      }

      if (error instanceof EmailAlreadyInUseError) {
        return responseHelper.conflict(res, error.message)
      }

      return responseHelper.internalServerError(res, 'Erro ao criar usuário')
    }
  }
}
