import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getOrCreateUser } from "@/lib/auth"
import { analyzeResume } from "@/lib/ai"
import { getRateLimitStatus, incrementUsage } from "@/lib/ratelimit"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: "未登录" }, { status: 401 })
  }

  let body: { resumeText?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 })
  }

  const resumeText =
    typeof body.resumeText === "string" ? body.resumeText.trim() : ""

  if (resumeText.length < 50) {
    return NextResponse.json(
      { error: "简历内容至少需要 50 个字符" },
      { status: 400 }
    )
  }
  if (resumeText.length > 5000) {
    return NextResponse.json(
      { error: "简历内容不能超过 5000 个字符" },
      { status: 400 }
    )
  }

  let user
  try {
    user = await getOrCreateUser()
  } catch {
    return NextResponse.json({ error: "用户认证失败" }, { status: 401 })
  }

  const { allowed, remaining, limit } = await getRateLimitStatus(
    user.id,
    user.plan
  )

  if (!allowed) {
    return NextResponse.json(
      {
        error: `今日分析次数已用完（${limit} 次/天），请明日再试或升级 Pro 版`,
        code: "RATE_LIMIT_EXCEEDED",
      },
      { status: 429 }
    )
  }

  let aiResult
  try {
    aiResult = await analyzeResume(resumeText)
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI 分析失败"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  await incrementUsage(user.id)

  const analysis = await prisma.resumeAnalysis.create({
    data: {
      userId: user.id,
      resumeText,
      score: aiResult.score,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      suggestions: aiResult.suggestions,
      revisedSummary: aiResult.revisedSummary,
    },
  })

  return NextResponse.json({
    id: analysis.id,
    score: aiResult.score,
    strengths: aiResult.strengths,
    weaknesses: aiResult.weaknesses,
    suggestions: aiResult.suggestions,
    revisedSummary: aiResult.revisedSummary,
    remaining: remaining === -1 ? -1 : remaining - 1,
  })
}
