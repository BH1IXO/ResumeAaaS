"use client"

import { useState } from "react"

const MAX_LENGTH = 5000

interface Props {
  onSubmit: (resumeText: string) => void
  loading: boolean
}

export default function ResumeForm({ onSubmit, loading }: Props) {
  const [text, setText] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || loading) return
    onSubmit(text.trim())
  }

  const pct = Math.min(100, (text.length / MAX_LENGTH) * 100)
  const isOverLimit = text.length > MAX_LENGTH
  const isTooShort = text.trim().length > 0 && text.trim().length < 50

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        简历内容
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        placeholder="请粘贴你的简历全文，包括个人信息、教育背景、工作经历、项目经历、技能等……"
        className="w-full resize-none text-sm text-gray-800 placeholder-gray-300 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
        disabled={loading}
      />

      {/* Progress bar + char count */}
      <div className="mt-2 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isOverLimit
                ? "bg-red-500"
                : pct > 80
                ? "bg-amber-400"
                : "bg-indigo-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          className={`text-xs tabular-nums ${
            isOverLimit ? "text-red-500" : "text-gray-400"
          }`}
        >
          {text.length} / {MAX_LENGTH}
        </span>
      </div>

      {isTooShort && (
        <p className="mt-2 text-xs text-amber-500">内容太短，至少需要 50 个字符</p>
      )}
      {isOverLimit && (
        <p className="mt-2 text-xs text-red-500">内容超出限制，请删减至 5000 字符以内</p>
      )}

      <button
        type="submit"
        disabled={loading || isOverLimit || text.trim().length < 50}
        className="mt-5 w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "AI 分析中…" : "开始 AI 分析"}
      </button>
    </form>
  )
}
