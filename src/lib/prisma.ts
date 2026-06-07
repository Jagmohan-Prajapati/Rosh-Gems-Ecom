import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

export function getPrisma(): PrismaClient {
  if (!prisma) {
    if (process.env.NODE_ENV === 'production') {
      prisma = new PrismaClient()
    } else {
      const globalWithPrisma = global as typeof globalThis & {
        prismaClient?: PrismaClient
      }
      if (!globalWithPrisma.prismaClient) {
        globalWithPrisma.prismaClient = new PrismaClient()
      }
      prisma = globalWithPrisma.prismaClient
    }
  }
  return prisma
}
