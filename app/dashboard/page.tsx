import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getOrCreateUser } from "@/lib/auth"
import { getRateLimitStatus } from "@/lib/ratelimit"
import { prisma } from "@/lib/prisma"
import Header from "@/components/Header"

export default async function DashboardPage() {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")

  const user = await getOrCreateUser()
  const { remaining, limit } = await getRateLimitStatus(user.id, user.plan)

  const analyses = await prisma.resumeAnalysis.findMany({
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

  const isFree = user.plan === "FREE"

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Stats row */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">套餐</p>
            <p className="text-2xl font-bold text-gray-900">
              {user.plan === "FREE" ? "免费版" : "Pro 版"}
            </p>
            {user.plan === "FREE" && (
              <Link href="/upgrade" className="text-xs text-indigo-600 hover:underline mt-1 inline-block">
                升级 Pro →
              </Link>
            )}
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">今日剩余次数</p>
            <p className="text-2xl font-bold text-gray-900">
              {isFree ? `${remaining} / ${limit}` : "无限"}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">总分析次数</p>
            <p className="text-2xl font-bold text-gray-900">{analyses.length}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-indigo-600 rounded-2xl p-8 mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">开始分析简历</h2>
            <p className="text-indigo-200 text-sm">
              粘贴简历内容，AI 秒速给出评分与建议
            </p>
          </div>
          <Link
            href="/analyze"
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
          >
            立即分析 →
          </Link>
        </div>

        {/* Free tier upgrade nudge */}
        {isFree && remaining === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-semibold text-amber-800">今日次数已用完</p>
                <p className="text-sm text-amber-600">明日重置，或升级 Pro 版获取无限次使用</p>
              </div>
            </div>
            <Link
              href="/upgrade"
              className="flex-shrink-0 text-sm bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              立即升级 →
            </Link>
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">历史分析记录</h2>
          {analyses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <p className="text-gray-400 mb-4">暂无分析记录</p>
              <Link href="/analyze" className="text-indigo-600 font-medium text-sm hover:underline">
                去分析第一份简历 →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((a) => (
                <Link
                  key={a.id}
                  href={`/analysis/${a.id}`}
                  className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                >
                  <ScoreBadge score={a.score} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">
                      {a.resumeText.slice(0, 120)}...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(a.createdAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                  <span className="text-xs text-gray-300 flex-shrink-0">查看详情 →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-100 text-emerald-700"
      : score >= 60
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700"

  return (
    <div
      className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${color}`}
    >
      <span className="text-lg font-bold leading-none">{score}</span>
      <span className="text-xs">分</span>
    </div>
  )
}
