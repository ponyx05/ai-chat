# Backend

后端子工程，基于 Express + MariaDB + TypeScript 构建的 AI 聊天应用后端 API 服务。

## 技术栈

| 技术       | 说明         |
| ---------- | ------------ |
| Node.js    | 运行时       |
| Express    | Web 框架     |
| MariaDB    | 关系型数据库 |
| Prisma     | ORM 框架     |
| JWT        | Token 认证   |
| bcryptjs   | 密码加密     |
| OpenAI SDK | AI 模型调用  |
| TypeScript | 类型安全     |

## 目录结构

```
packages/backend/
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── jest.config.ts         # Jest 测试配置
├── prisma/
│   └── schema.prisma       # Prisma 数据模型
└── src/
    ├── index.ts            # 启动入口
    ├── app.ts              # Express 应用入口
    ├── lib/                # 库文件
    │   └── prisma.ts       # Prisma 客户端实例
    ├── middleware/          # 中间件
    │   ├── auth.ts         # JWT 认证中间件
    │   └── errorHandler.ts # 统一错误处理
    ├── modules/            # 功能模块（四层架构）
    │   ├── auth/           # 认证模块
    │   │   ├── controller.ts    # 控制层：HTTP 请求处理
    │   │   ├── routes.ts        # 路由层：API 路由定义
    │   │   ├── service.ts       # 业务层：核心业务逻辑
    │   │   ├── user.repository.ts   # 数据层：用户 DB 操作
    │   │   └── token.repository.ts  # 数据层：令牌 DB 操作
    │   ├── chat/           # 聊天模块
    │   │   ├── ai.service.ts     # AI 模型调用
    │   │   ├── controller.ts     # 控制层：HTTP 请求处理
    │   │   ├── routes.ts        # 路由层：API 路由定义
    │   │   ├── service.ts        # 业务层：核心业务逻辑
    │   │   └── repository.ts     # 数据层：会话/消息 DB 操作
    │   └── user/           # 用户模块
    │       ├── controller.ts     # 控制层：HTTP 请求处理
    │       ├── routes.ts        # 路由层：API 路由定义
    │       └── service.ts       # 业务层：核心业务逻辑
    ├── types/              # 类型定义
    │   └── index.ts
    ├── utils/              # 工具函数
    │   ├── jwt.ts
    │   ├── password.ts
    │   └── index.ts
    └── tests/              # 测试文件
        ├── settings/setup.ts
        ├── ai-chat.test.ts
        └── auth.test.ts
```

## 四层架构

| 层级 | 文件后缀 | 职责 |
| ---- | -------- | ---- |
| Route | `.routes.ts` | 定义 API 路径、请求方法，将请求分发到 Controller |
| Controller | `.controller.ts` | 接收 HTTP 请求，参数校验，调用 Service，封装响应 |
| Service | `.service.ts` | 实现业务逻辑（权限判断、业务规则），不直接接触数据库 |
| Repository | `.repository.ts` | 封装数据库 CRUD 操作，隐藏数据库查询细节 |

## 环境变量

创建 `.env` 文件，配置以下变量：

```env
# 数据库连接
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=123456
DATABASE_NAME=ai_chat_test

# JWT 密钥
JWT_SECRET=your-secret-key

# AI 模型配置（MiniMax 兼容 OpenAI API）
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.minimaxi.com/v1
OPENAI_MODEL=MiniMax-M2.7
```

## API 接口

### 认证接口

| 方法 | 路径               | 说明         |
| ---- | ------------------ | ------------ |
| POST | /api/auth/register | 用户注册     |
| POST | /api/auth/login    | 用户登录     |
| POST | /api/auth/logout   | 用户登出     |
| GET  | /api/auth/me       | 获取当前用户 |

### 用户接口

| 方法 | 路径                | 说明     |
| ---- | ------------------- | -------- |
| PUT  | /api/users/password | 修改密码 |

### 聊天接口

| 方法   | 路径                              | 说明             |
| ------ | --------------------------------- | ---------------- |
| GET    | /api/chat/sessions                | 获取会话列表     |
| PUT    | /api/chat/sessions/:id           | 修改会话标题     |
| DELETE | /api/chat/sessions/:id           | 删除会话         |
| GET    | /api/chat/sessions/:sessionId/messages | 获取消息列表 |
| POST   | /api/chat/messages               | 发送消息（SSE）  |

## 注意事项

- 开发服务器默认运行在 http://localhost:4000
- 需确保 MariaDB 服务已启动
- 首次使用需运行 `pnpm db:push` 同步数据库 schema
- Token 有效期为 7 天
- AI 功能需配置有效的 API Key（MiniMax 或 OpenAI 兼容 API）