import { v4 as uuidv4 } from 'uuid'
import {
  IPostgresCreateTransactionRepository,
  IPostgresGetUserByIdRepository,
} from '../../repositories/postgres'
import {
  ITransactionParams,
  ITransactionResponse,
} from '../../types/transaction.type'

export interface ICreateTransactionUseCase {
  execute(
    createTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse>
}

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  private createTransactionRepository: IPostgresCreateTransactionRepository
  private getUserByIdRepository: IPostgresGetUserByIdRepository

  constructor(
    createTransactionRepository: IPostgresCreateTransactionRepository,
    getUserByIdRepository: IPostgresGetUserByIdRepository,
  ) {
    this.createTransactionRepository = createTransactionRepository
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(
    createTransactionParams: ITransactionParams,
  ): Promise<ITransactionResponse> {
    const user = await this.getUserByIdRepository.execute({
      id: createTransactionParams.user_id,
    })
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const transactionId = uuidv4()
    const payload = {
      ...createTransactionParams,
      id: transactionId,
    }
    try {
      return await this.createTransactionRepository.execute(payload)
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      throw new Error('Erro ao criar transação')
    }
  }
}
