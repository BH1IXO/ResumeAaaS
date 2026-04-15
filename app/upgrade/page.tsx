"use client"

import Header from "@/components/Header"

function PaymentButton({
  label,
  description,
}: {
  label: string
  description: string
}) {
  function handleClick() {
    alert(`${description}\n\n请联系客服升级：support@resumeai.com`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full border border-gray-200 rounded-xl px-5 py-4 text-left hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
    >
      <p className="font-medium text-gray-800 group-hover:text-indigo-700">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </button>
  )
}

const features = [
  { free: "每日 3 次分析", pro: "无限次分析" },
  { free: "基础分析结果", pro: "完整分析 + AI 优化示范" },
  { free: "历史记录保存", pro: "历史记录保存" },
  { free: "—", pro: "优先 AI 响应速度" },
]

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-14">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">升级 Pro，无限使用</h1>
          <p className="text-gray-500">一次升级，永久解锁无限次 AI 简历分析</p>
        </div>

        {/* 对比表 */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* FREE */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <p className="text-sm font-medium text-gray-400 mb-2">免费版</p>
            <p className="text-4xl font-extrabold text-gray-900 mb-6">
              ¥0 <span className="text-base font-normal text-gray-400">/ 月</span>
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f.free} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className={f.free === "—" ? "text-gray-300" : "text-emerald-500"}>
                    {f.free === "—" ? "✕" : "✓"}
                  </span>
                  {f.free}
                </li>
              ))}
            </ul>
          </div>

          {/* PRO */}
          <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              推荐
            </div>
            <p className="text-sm font-medium text-indigo-200 mb-2">Pro 版</p>
            <p className="text-4xl font-extrabold mb-6">
              ¥29 <span className="text-base font-normal text-indigo-300">/ 月</span>
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f.pro} className="flex items-center gap-2 text-sm text-indigo-100">
                  <span className="text-amber-400">✓</span>
                  {f.pro}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 支付方式 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">选择支付方式</h2>
          <p className="text-sm text-gray-400 mb-6">
            支付集成开发中，当前可联系客服手动开通 Pro 权限
          </p>

          <div className="space-y-3 mb-8">
            <PaymentButton
              label="💳 Stripe 信用卡支付"
              description="支持 Visa / Mastercard / American Express，适合海外用户"
            />
            <PaymentButton
              label="🔵 支付宝"
              description="扫码支付，实时到账，适合国内用户"
            />
          </div>

          {/* 支付流程说明 */}
          <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-500 space-y-2">
            <p className="font-medium text-gray-700 mb-3">支付流程（上线后生效）</p>
            <div className="space-y-1.5">
              <p>
                <span className="font-medium text-gray-600">Stripe：</span>
                点击后跳转 Stripe Checkout → 填写卡号完成支付 → Webhook 回调自动升级账户
              </p>
              <p>
                <span className="font-medium text-gray-600">支付宝：</span>
                跳转支付宝收银台 → 扫码或账号支付 → 异步通知回调自动升级账户
              </p>
            </div>
            <p className="text-xs text-gray-400 pt-2">升级后立即生效，如有问题请联系 support@resumeai.com</p>
          </div>
        </div>
      </main>
    </div>
  )
}
