# AI-Chat项目

## 环境

nodejs v22.15.0
pnpm 包管理器

pnpm i 安装依赖
npx prisma generate 生成Prisma客户端

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
