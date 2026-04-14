import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ResumeAI — AI 简历优化",
  description: "AI 驱动的专业简历分析与优化工具，获取评分、改进建议、AI 重写示范",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="zh-CN">
        <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
