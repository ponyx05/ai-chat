<div align="center">
  
<!-- Keep these links. Translations will automatically update with the README. -->
[Deutsch](https://zdoc.app/de/ponyx05/ai-chat) | 
[English](https://zdoc.app/en/ponyx05/ai-chat) | 
[Español](https://zdoc.app/es/ponyx05/ai-chat) | 
[français](https://zdoc.app/fr/ponyx05/ai-chat) | 
[日本語](https://zdoc.app/ja/ponyx05/ai-chat) | 
[한국어](https://zdoc.app/ko/ponyx05/ai-chat) | 
[Português](https://zdoc.app/pt/ponyx05/ai-chat) | 
[Русский](https://zdoc.app/ru/ponyx05/ai-chat) | 
[中文](https://zdoc.app/zh/ponyx05/ai-chat)

</div>

# AI Chat Monorepo

## 项目简介

该工程是一个 AI 聊天系统，基于 pnpm + monorepo 构建

## 目录结构

- `apps/frontend/` - 前端工程（Vue 3 + Vite + TypeScript）
- `apps/backend/` - 后端工程（Express + TypeScript + Prisma + MariaDB）
- `docs/api/` - API接口文档

## 环境

nodejs v22.15.0

pnpm 包管理器

根目录下执行统一安装前后端依赖 pnpm i 

backend生成Prisma客户端 npx prisma generate 

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
SYSTEM_PROMPT=
```
