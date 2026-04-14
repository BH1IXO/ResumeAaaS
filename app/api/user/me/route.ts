import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getOrCreateUser } from "@/lib/auth"
import { getRateLimitStatus } from "@/lib/ratelimit"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: "未登录" }, { status: 401 })
  }

  let user
  try {
    user = await getOrCreateUser()
  } catch {
    return NextResponse.json({ error: "用户认证失败" }, { status: 401 })
  }

  const { remaining, limit } = await getRateLimitStatus(user.id, user.plan)

  const recentAnalyses = await prisma.resumeAnalysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      score: true,
      createdAt: true,
      resumeText: true,
    },
  })

  return NextResponse.json({
    plan: user.plan,
    remaining,
    limit,
    recentAnalyses: recentAnalyses.map((a) => ({
      id: a.id,
      score: a.score,
      createdAt: a.createdAt,
      resumePreview: a.resumeText.slice(0, 100) + "…",
    })),
  })
}
