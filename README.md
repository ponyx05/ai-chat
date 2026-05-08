# AI Chat Monorepo

## 项目简介

该工程是一个 AI 聊天系统，基于 pnpm + monorepo 构建

## 目录结构

- `apps/frontend/` - 前端工程（Vue 3 + Vite + TypeScript）
- `apps/backend/` - 后端工程（Express + TypeScript + Prisma + Mysql）

## 环境

nodejs v22.15.0
pnpm 包管理器

pnpm i 根目录下安装依赖  
npx prisma generate backend生成Prisma客户端

## env配置

`backend/.env`

```
PORT=服务端端口
JWT_SECRET='your-secret-key-change-in-production'

# Prisma数据库连接
# TEST_DATABASE_NAME=
DATABASE_URL="mysql://username:password@localhost:port/DATABASE_NAME"

DATABASE_HOST=localhost
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

# OpenAI
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=
```
