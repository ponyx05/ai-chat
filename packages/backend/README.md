# Backend

后端子工程，基于 Express + MySQL + TypeScript 构建的 AI 聊天应用后端 API 服务。

## 技术栈

| 技术       | 说明         |
| ---------- | ------------ |
| Node.js    | 运行时       |
| Express    | Web 框架     |
| MySQL      | 关系型数据库 |
| Prisma     | ORM 框架     |
| JWT        | Token 认证   |
| bcryptjs   | 密码加密     |
| TypeScript | 类型安全     |

## 目录结构

```
packages/backend/
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── jest.config.ts          # Jest 测试配置
├── prisma.config.ts        # Prisma 配置文件
├── prisma/
│   ├── schema.prisma       # Prisma 数据模型
│   └── migrations/         # 数据库迁移文件
└── src/
    ├── index.ts            # 启动入口
    ├── app.ts              # Express 应用入口
    ├── lib/                 # 库文件
    │   └── prisma.ts        # Prisma 客户端实例
    ├── models/              # 数据模型
    │   ├── index.ts         # 统一导出
    │   ├── token.ts         # Token 模型
    │   └── user.ts          # User 模型
    ├── middleware/          # 中间件
    │   ├── auth.ts          # JWT 认证中间件
    │   └── errorHandler.ts  # 统一错误处理
    ├── routes/              # 路由
    │   ├── auth.ts          # 认证路由 (注册/登录/登出/当前用户)
    │   ├── users.ts         # 用户路由 (修改密码)
    │   ├── hello.ts         # 测试路由
    │   └── index.ts         # 统一导出
    ├── services/            # 业务逻辑
    │   ├── authService.ts   # 认证业务逻辑
    │   ├── userService.ts   # 用户业务逻辑
    │   └── index.ts         # 统一导出
    ├── types/               # 类型定义
    │   └── index.ts         # TypeScript 类型定义
    ├── utils/               # 工具函数
    │   ├── jwt.ts           # JWT 工具
    │   ├── password.ts      # 密码加密
    │   └── index.ts         # 统一导出
    └── e2e/                  # 端到端测试
        └── auth.test.ts     # 认证接口测试
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

## 注意事项

- 开发服务器默认运行在 http://localhost:4000
- 需确保 MySQL 服务已启动
- 首次使用需运行 `pnpm db:push` 同步数据库 schema
- Token 有效期为 7 天
