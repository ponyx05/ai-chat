# AI Chat Monorepo

## 项目简介

前后端分离的Monorepo工程，使用pnpm workspace管理。前端Vue3+Ant Design Vue，后端Express+MySQL，均使用TypeScript。

## 技术栈

| 子工程 | 技术 |
|--------|------|
| frontend | Vite 6 + Vue 3 + Ant Design Vue 4 + Pinia + Vue Router + Axios + TypeScript |
| backend | Express + MySQL + JWT + bcryptjs + TypeScript |
| monorepo | pnpm workspace |

## 关键目录结构

```
ai-chat/
├── package.json              # 根package.json，pnpm workspace
├── pnpm-workspace.yaml       # workspace配置
├── API-DOCS.md               # 接口文档
├── AGENTS.md                 # AI交互规范
├── packages/
│   ├── frontend/             # 前端子工程
│   │   ├── README.md         # 工程说明
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── main.ts       # 入口文件
│   │       ├── App.vue       # 根组件
│   │       ├── env.d.ts
│   │       ├── apis/         # API调用层
│   │       ├── components/   # 通用组件
│   │       ├── pages/        # 页面组件
│   │       ├── router/       # 路由配置
│   │       ├── store/        # 状态管理
│   │       └── utils/        # 工具函数
│   └── backend/              # 后端子工程
│       ├── README.md         # 工程说明
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts      # 启动入口
│           ├── app.ts         # Express应用入口
│           ├── config/        # 配置
│           ├── middleware/    # 中间件
│           ├── models/       # 数据模型
│           ├── routes/       # 路由
│           ├── services/     # 业务逻辑
│           ├── types/        # 类型定义
│           └── utils/        # 工具函数
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动所有工程（并行）
pnpm dev

# 启动单个工程
cd packages/frontend && pnpm dev
cd packages/backend && pnpm dev

# 构建
pnpm build
```

## 注意事项

- 前端默认运行在 http://localhost:3000
- 后端默认运行在 http://localhost:4000
- 前端已配置API代理到后端 /api/*
- 路由守卫：未登录自动跳转登录页
- Token 有效期为 7 天
