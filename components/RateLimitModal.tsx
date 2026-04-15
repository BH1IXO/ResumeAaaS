"use client"

import Link from "next/link"

interface Props {
  onClose: () => void
}

export default function RateLimitModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">⚡</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">今日免费次数已用完</h2>
          <p className="text-sm text-gray-500">每日 3 次免费额度已耗尽，明日 0 点自动重置</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
          {[
            ["免费版", "每日 3 次", "text-gray-500"],
            ["Pro 版", "无限次使用", "text-indigo-600 font-semibold"],
          ].map(([plan, desc, cls]) => (
            <div key={plan} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{plan}</span>
              <span className={cls}>{desc}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link
            href="/upgrade"
            className="block w-full text-center bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            升级 Pro — 无限次使用
          </Link>
          <button
            onClick={onClose}
            className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
          >
            明天再来
          </button>
        </div>
      </div>
    </div>
  )
}
