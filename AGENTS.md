# AI Chat Monorepo

## 项目简介

前后端分离的Monorepo工程，使用pnpm workspace管理。前端Vue3+ElementPlus，后端Express+MySQL，均使用TypeScript。

## 技术栈

| 子工程 | 技术 |
|--------|------|
| frontend | Vite 6 + Vue 3 + ElementPlus + TypeScript |
| backend | Express + MySQL + TypeScript |
| monorepo | pnpm workspace |

## 关键目录结构

```
ai-chat/
├── package.json              # 根package.json，pnpm workspace
├── pnpm-workspace.yaml       # workspace配置
├── API-DOCS.md             # 接口文档
├── packages/
│   ├── frontend/             # 前端子工程
│   │   ├── README.md         # 工程说明
│   │   ├── src/
│   │   │   ├── main.ts       # 入口文件
│   │   │   ├── App.vue       # 根组件
│   │   │   └── components/
│   │   │       └── HelloWorld.vue
│   │   └── vite.config.ts
│   └── backend/              # 后端子工程
│       └── src/
│           ├── index.ts      # 入口文件
│           ├── config/
│           │   └── database.ts  # 数据库配置
│           └── routes/
│               └── hello.ts  # 示例路由
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
```

## 注意事项

- 前端默认运行在 http://localhost:3000
- 后端默认运行在 http://localhost:4000
- 前端已配置API代理到后端 /api/*
