"use client"

import { useState } from "react"
import Header from "@/components/Header"
import ResumeForm from "@/components/ResumeForm"
import AnalysisResult from "@/components/AnalysisResult"
import RateLimitModal from "@/components/RateLimitModal"
import type { AnalysisResult as AnalysisResultType } from "@/lib/ai"

interface AnalysisResponse extends AnalysisResultType {
  id: string
  remaining: number
}

export default function AnalyzePage() {
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showRateLimitModal, setShowRateLimitModal] = useState(false)

  async function handleSubmit(resumeText: string) {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429 && data.code === "RATE_LIMIT_EXCEEDED") {
          setShowRateLimitModal(true)
        } else {
          setError(data.error ?? "分析失败，请重试")
        }
        return
      }

      setResult(data)
    } catch {
      setError("网络错误，请检查连接后重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">AI 简历分析</h1>
          <p className="text-gray-500 text-sm">粘贴简历内容（50–5000字），AI 即时分析</p>
        </div>

        <ResumeForm onSubmit={handleSubmit} loading={loading} />

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-10 flex flex-col items-center gap-3 text-gray-400">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm">AI 正在分析你的简历，通常需要 5–15 秒…</p>
          </div>
        )}

        {result && !loading && (
          <div className="mt-10">
            <AnalysisResult result={result} />
            {result.remaining >= 0 && (
              <p className="mt-4 text-center text-xs text-gray-400">
                今日还剩 <strong>{result.remaining}</strong> 次免费分析
              </p>
            )}
          </div>
        )}
      </main>

      {showRateLimitModal && (
        <RateLimitModal onClose={() => setShowRateLimitModal(false)} />
      )}
    </div>
  )
}
