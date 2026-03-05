import { Prisma } from '../../generated/prisma/client'

export function isPrismaKnownRequestError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError
}

export function isPrismaErrorCode(error: unknown, code: string): boolean {
  return isPrismaKnownRequestError(error) && error.code === code
}
