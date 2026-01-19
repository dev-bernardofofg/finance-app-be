/**
 * Tipo que representa um usuário sem informações sensíveis (sem password)
 * Usado para retornos de APIs e respostas de repositórios
 */
export type UserResponse = {
  id: string
  first_name: string
  last_name: string
  email: string
}
