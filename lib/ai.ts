const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions"
const MAX_RESUME_LENGTH = 5000
const MIN_RESUME_LENGTH = 50

export interface AnalysisResult {
  score: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  revisedSummary: string
}

export async function analyzeResume(resumeText: string): Promise<AnalysisResult> {
  if (resumeText.length < MIN_RESUME_LENGTH) {
    throw new Error(`简历内容至少需要 ${MIN_RESUME_LENGTH} 个字符`)
  }
  if (resumeText.length > MAX_RESUME_LENGTH) {
    throw new Error(`简历内容不能超过 ${MAX_RESUME_LENGTH} 个字符`)
  }

  const apiKey = process.env.KIMI_API_KEY
  if (!apiKey) {
    throw new Error("AI 服务未配置")
  }

  const response = await fetch(KIMI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "moonshot-v1-8k",
      messages: [
        {
          role: "system",
          content:
            "你是一位资深HR和职业顾问，专注于简历优化。请严格以JSON格式返回分析结果，不输出任何其他内容。",
        },
        {
          role: "user",
          content: `请分析以下简历，返回如下JSON结构：

{
  "score": <0-100整数，综合评分>,
  "strengths": [<3-5条优点，每条一句话，不超过30字>],
  "weaknesses": [<3-5条不足，每条一句话，不超过30字>],
  "suggestions": [<3-5条具体可操作改进建议，每条不超过50字>],
  "revisedSummary": "<优化后的个人简介或核心竞争力，100-150字>"
}

评分维度（各20%）：内容完整性、技能描述质量、成就量化程度、专业表达、格式规范。

简历内容：
${resumeText}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000,
    }),
    signal: AbortSignal.timeout(30000),
  })

  if (!response.ok) {
    if (response.status === 401) throw new Error("AI 服务认证失败，请检查 API Key")
    if (response.status === 429) throw new Error("AI 服务请求过于频繁，请稍后重试")
    throw new Error(`AI 服务异常 (${response.status})`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error("AI 未返回有效内容")
  }

  let result: AnalysisResult
  try {
    result = JSON.parse(content)
  } catch {
    throw new Error("AI 返回数据解析失败")
  }

  if (
    typeof result.score !== "number" ||
    !Array.isArray(result.strengths) ||
    !Array.isArray(result.weaknesses) ||
    !Array.isArray(result.suggestions)
  ) {
    throw new Error("AI 返回数据格式异常")
  }

  result.score = Math.min(100, Math.max(0, Math.round(result.score)))
  result.strengths = result.strengths.slice(0, 5)
  result.weaknesses = result.weaknesses.slice(0, 5)
  result.suggestions = result.suggestions.slice(0, 5)
  result.revisedSummary = result.revisedSummary ?? ""

  return result
}
