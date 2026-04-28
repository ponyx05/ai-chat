# Backend

后端子工程，基于 Express + MySQL + TypeScript

## 技术栈

- **运行时**: Node.js
- **框架**: Express
- **数据库**: MySQL
- **数据库驱动**: mysql2
- **语言**: TypeScript

## 目录结构

```
backend/
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
└── src/
    ├── index.ts            # 入口文件
    ├── config/
    │   └── database.ts     # 数据库配置
    └── routes/
        └── hello.ts        # 示例路由
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 数据库配置

通过环境变量配置：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| DB_HOST | localhost | 数据库主机 |
| DB_PORT | 3306 | 数据库端口 |
| DB_USER | root | 数据库用户名 |
| DB_PASSWORD | (空) | 数据库密码 |
| DB_NAME | ai_chat | 数据库名 |

## 注意事项

- 开发服务器默认运行在 http://localhost:4000
- 需确保 MySQL 服务已启动
