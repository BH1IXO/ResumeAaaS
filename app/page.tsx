import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default function LandingPage() {
  const { userId } = auth()
  if (userId) redirect("/dashboard")

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">ResumeAI</span>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              登录
            </Link>
            <Link
              href="/sign-up"
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              免费开始
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          KIMI AI 驱动
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight max-w-3xl mb-6">
          让 AI 帮你优化简历
          <br />
          <span className="text-indigo-600">提升面试通过率</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          粘贴简历，AI 秒速分析 — 获得综合评分、精准不足点、可操作改进建议、AI 重写示范
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-up"
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            免费开始 — 每日 3 次
          </Link>
          <Link
            href="#features"
            className="text-gray-600 hover:text-gray-900 font-medium text-base"
          >
            了解功能 →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">功能亮点</h2>
          <p className="text-center text-gray-500 mb-14">基于大语言模型，真正理解简历内容</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "AI 综合评分",
                desc: "从内容完整性、技能描述、成就量化、专业表达、格式规范五个维度打分",
              },
              {
                icon: "🎯",
                title: "精准问题定位",
                desc: "识别简历中的具体不足，给出可直接落地的改进建议",
              },
              {
                icon: "✍️",
                title: "AI 重写示范",
                desc: "对个人简介和核心竞争力部分给出优化后的示例版本",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">简单定价</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-2">免费版</p>
              <p className="text-4xl font-extrabold text-gray-900 mb-1">
                ¥0 <span className="text-base font-normal text-gray-400">/ 月</span>
              </p>
              <p className="text-sm text-gray-400 mb-8">每日 3 次分析</p>
              <ul className="space-y-3 mb-8">
                {["AI 综合评分", "优点 & 不足分析", "改进建议", "每日 3 次限额"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-emerald-500">✓</span>
                      {item}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center border border-indigo-600 text-indigo-600 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
              >
                免费开始
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                PRO
              </div>
              <p className="text-sm font-medium text-indigo-200 mb-2">Pro 版</p>
              <p className="text-4xl font-extrabold mb-1">
                ¥29 <span className="text-base font-normal text-indigo-300">/ 月</span>
              </p>
              <p className="text-sm text-indigo-300 mb-8">无限次分析</p>
              <ul className="space-y-3 mb-8">
                {[
                  "免费版全部功能",
                  "无限次分析",
                  "历史记录保存",
                  "优先 AI 响应速度",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-indigo-100">
                    <span className="text-amber-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="block w-full text-center bg-white/20 text-white py-3 rounded-xl font-medium cursor-not-allowed opacity-70"
              >
                即将开放
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © 2024 ResumeAI. Powered by KIMI AI.
      </footer>
    </div>
  )
}
