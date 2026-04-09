import { prisma } from './prisma/prisma'

module.exports = async function () {
  await prisma.$disconnect()
}
