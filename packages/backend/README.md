# Backend

后端子工程，基于 Express + MySQL + TypeScript

## 技术栈

- **运行时**: Node.js
- **框架**: Express
- **数据库**: MySQL
- **数据库驱动**: mysql2
- **认证**: JWT (jsonwebtoken), bcryptjs
- **语言**: TypeScript

## 目录结构

```
packages/backend/
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
└── src/
    ├── index.ts            # 启动入口
    ├── app.ts              # Express 应用入口
    ├── config/
    │   └── database.ts     # 数据库配置
    ├── middleware/
    │   ├── auth.ts         # JWT 认证中间件
    │   └── errorHandler.ts # 统一错误处理
    ├── models/
    │   ├── user.ts         # 用户模型
    │   ├── token.ts        # Token 模型
    │   └── index.ts        # 统一导出
    ├── routes/
    │   ├── auth.ts         # 认证路由 (注册/登录/登出/当前用户)
    │   ├── users.ts        # 用户路由 (修改密码)
    │   ├── hello.ts        # 示例路由
    │   └── index.ts        # 统一导出
    ├── services/
    │   ├── authService.ts  # 认证业务逻辑
    │   ├── userService.ts  # 用户业务逻辑
    │   └── index.ts        # 统一导出
    ├── types/
    │   └── index.ts        # TypeScript 类型定义
    └── utils/
        ├── jwt.ts          # JWT 工具
        ├── password.ts     # 密码加密
        └── index.ts        # 统一导出
```

## 开发命令

```bash
# 开发模式 (热重载)
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 数据库配置

通过环境变量配置：

| 变量        | 默认值    | 说明         |
| ----------- | --------- | ------------ |
| DB_HOST     | localhost | 数据库主机   |
| DB_PORT     | 3306      | 数据库端口   |
| DB_USER     | root      | 数据库用户名 |
| DB_PASSWORD | (空)      | 数据库密码   |
| DB_NAME     | ai_chat   | 数据库名     |

## API 接口

### 认证接口

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/logout | 用户登出 |
| GET | /api/auth/me | 获取当前用户 |

### 用户接口

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| PUT | /api/users/password | 修改密码 |

## 注意事项

- 开发服务器默认运行在 http://localhost:4000
- 需确保 MySQL 服务已启动
- Token 有效期为 7 天
