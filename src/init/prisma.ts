import { container } from '@sapphire/framework'
import { PrismaClient } from '@prisma/client'

declare module '@sapphire/pieces' {
  interface Container {
    prisma: PrismaClient
  }
}

function initPrisma() {
  container.prisma = new PrismaClient()
}

export { initPrisma }
