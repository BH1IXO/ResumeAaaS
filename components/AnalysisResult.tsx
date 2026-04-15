"use client"

import { useState } from "react"
import type { AnalysisResult as AnalysisResultType } from "@/lib/ai"

interface Props {
  result: AnalysisResultType & { id: string }
}

function buildCopyText(result: AnalysisResultType): string {
  return `【简历评分】${result.score}分

【优点】
${result.strengths.map((s) => `• ${s}`).join("\n")}

【不足】
${result.weaknesses.map((s) => `• ${s}`).join("\n")}

【改进建议】
${result.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}
${
  result.revisedSummary
    ? `\n【AI优化示范】\n${result.revisedSummary}`
    : ""
}`
}

function CopyButton({
  text,
  label = "复制",
  className = "",
}: {
  text: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
        copied
          ? "bg-emerald-100 text-emerald-700"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      } ${className}`}
    >
      {copied ? "已复制 ✓" : label}
    </button>
  )
}

export default function AnalysisResult({ result }: Props) {
  return (
    <div className="space-y-6">
      {/* Score */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <ScoreRing score={result.score} />
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">简历综合评分</h2>
            <p className="text-sm text-gray-500">
              {result.score >= 80
                ? "优秀 — 简历质量很高，可以直接投递"
                : result.score >= 60
                ? "良好 — 有一些提升空间，建议优化后投递"
                : "待改进 — 简历存在明显不足，建议按建议修改"}
            </p>
          </div>
        </div>
        <CopyButton text={buildCopyText(result)} label="复制全部结果" />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Section
          title="✅ 优点"
          items={result.strengths}
          itemClass="text-emerald-700"
          headerClass="text-emerald-700"
          bgClass="bg-emerald-50 border-emerald-100"
        />
        <Section
          title="⚠️ 不足"
          items={result.weaknesses}
          itemClass="text-red-700"
          headerClass="text-red-700"
          bgClass="bg-red-50 border-red-100"
        />
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">💡 改进建议</h3>
        <ol className="space-y-3">
          {result.suggestions.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Revised Summary */}
      {result.revisedSummary && (
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-indigo-900">✍️ AI 优化示范（个人简介）</h3>
            <CopyButton text={result.revisedSummary} label="复制示范" />
          </div>
          <p className="text-sm text-indigo-800 leading-relaxed whitespace-pre-wrap">
            {result.revisedSummary}
          </p>
        </div>
      )}
    </div>
  )
}

function Section({
  title,
  items,
  itemClass,
  headerClass,
  bgClass,
}: {
  title: string
  items: string[]
  itemClass: string
  headerClass: string
  bgClass: string
}) {
  return (
    <div className={`rounded-2xl border p-6 ${bgClass}`}>
      <h3 className={`font-semibold mb-4 ${headerClass}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`text-sm flex items-start gap-2 ${itemClass}`}>
            <span className="mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"

  return (
    <div className="relative flex-shrink-0">
      <svg width="120" height="120" className="-rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={radius} strokeWidth="8" stroke="#f3f4f6" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="8"
          stroke={color}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  )
}
