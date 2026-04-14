# ResumeAaaS 项目规范

## 技术栈

- **框架**：Next.js 14+ App Router + TypeScript
- **认证**：Clerk v5（`clerkMiddleware`，非旧版 `authMiddleware`）
- **AI**：KIMI API（Moonshot，`moonshot-v1-8k`，OpenAI 兼容格式）
- **数据库**：Prisma + PostgreSQL
- **样式**：Tailwind CSS
- **部署**：Vercel

## 目录结构

```
app/          页面与 API 路由
components/   UI 组件
lib/          工具模块（ai、prisma、auth、ratelimit）
prisma/       数据模型
middleware.ts 路由保护
```

## 代码规范

- 不写无意义注释
- 只做当前需求，不过度封装
- 服务端逻辑（DB、AI 调用）放在 API 路由或 Server Component，不暴露到客户端
- 环境变量只在服务端使用（`KIMI_API_KEY`、`CLERK_SECRET_KEY` 等不加 `NEXT_PUBLIC_` 前缀）
- 输入验证在 API 路由入口统一处理

## 代码提交规范

每次完成功能开发或修改后，自动执行以下步骤提交并推送到 GitHub：

1. `git add .`
2. `git commit -m "描述"` —— commit message 用中文，简洁描述本次改动内容
3. `git push`

commit message 格式参考：

- 新功能：`feat: 新增单词管理页`
- 修复：`fix: 修复翻转动画在 Safari 的兼容问题`
- 优化：`chore: 更新 .gitignore`

## 权限与安全

- 所有 `/api/*` 路由必须校验 Clerk session
- 免费用户每日限 3 次分析，基于 `DailyUsage` 表实现
- Pro 权限通过 `user.plan` 字段控制，暂不接入真实支付
- 简历内容限制 50–5000 字符，防止滥用 AI 接口
