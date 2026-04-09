import { prisma } from './src/prisma/prisma'

beforeEach(async () => {
  await prisma.transaction.deleteMany({})
  await prisma.user.deleteMany({})
})
