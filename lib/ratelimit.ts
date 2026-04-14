import { prisma } from "./prisma"

const FREE_DAILY_LIMIT = 3

export async function getRateLimitStatus(userId: string, plan: string) {
  if (plan === "PRO") {
    return { allowed: true, remaining: -1, limit: -1 }
  }

  const today = new Date().toISOString().split("T")[0]
  const usage = await prisma.dailyUsage.findUnique({
    where: { userId_date: { userId, date: today } },
  })

  const count = usage?.count ?? 0
  const remaining = FREE_DAILY_LIMIT - count

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    limit: FREE_DAILY_LIMIT,
  }
}

export async function incrementUsage(userId: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0]
  await prisma.dailyUsage.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, count: 1 },
    update: { count: { increment: 1 } },
  })
}
