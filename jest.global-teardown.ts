import { prisma } from './src/prisma/prisma'

module.exports = async function () {
  await prisma.$disconnect()
}
