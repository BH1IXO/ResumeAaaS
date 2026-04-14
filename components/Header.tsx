"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold text-indigo-600">
          ResumeAI
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            概览
          </Link>
          <Link
            href="/analyze"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            分析简历
          </Link>
          <UserButton afterSignOutUrl="/" />
        </nav>
      </div>
    </header>
  )
}
