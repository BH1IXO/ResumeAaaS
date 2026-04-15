import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getOrCreateUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Header from "@/components/Header"
import AnalysisResult from "@/components/AnalysisResult"

export default async function AnalysisDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")

  const user = await getOrCreateUser()

  const analysis = await prisma.resumeAnalysis.findUnique({
    where: { id: params.id },
  })

  if (!analysis || analysis.userId !== user.id) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">历史分析详情</h1>
            <p className="text-sm text-gray-400">
              分析时间：{new Date(analysis.createdAt).toLocaleString("zh-CN")}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            ← 返回仪表盘
          </Link>
        </div>

        <AnalysisResult
          result={{
            id: analysis.id,
            score: analysis.score,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            suggestions: analysis.suggestions,
            revisedSummary: analysis.revisedSummary ?? "",
          }}
        />
      </main>
    </div>
  )
}
