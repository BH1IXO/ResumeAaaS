import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getOrCreateUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const analysis = await prisma.resumeAnalysis.findUnique({
    where: { id: params.id },
  })

  if (!analysis) {
    return NextResponse.json({ error: "记录不存在" }, { status: 404 })
  }

  if (analysis.userId !== user.id) {
    return NextResponse.json({ error: "无权访问" }, { status: 403 })
  }

  return NextResponse.json(analysis)
}
