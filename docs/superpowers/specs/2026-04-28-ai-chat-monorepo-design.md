# AI Chat Monorepo 项目设计

## 1. 项目概述

- **项目名称**: ai-chat
- **项目类型**: Monorepo (pnpm workspace)
- **功能**: 前后端分离项目，前端Vue3+ElementPlus，后端Express+MySQL，均使用TypeScript

## 2. 技术栈

| 子工程 | 技术 |
|--------|------|
| frontend | Vite 6 + Vue 3 + ElementPlus + TypeScript |
| backend | Express + MySQL + TypeScript |
| monorepo | pnpm workspace |

## 3. 项目结构

```
ai-chat/
├── package.json            # 根package.json，pnpm workspace
├── pnpm-workspace.yaml     # workspace配置
├── packages/
│   ├── frontend/           # 前端子工程
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.ts
│   │       ├── App.vue
│   │       └── components/
│   │           └── HelloWorld.vue
│   └── backend/             # 后端子工程
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           └── routes/
│               └── hello.ts
└── docs/superpowers/specs/
```

## 4. 示例代码

### frontend
- `App.vue`: 显示"Hello from Vue!"
- `HelloWorld.vue`: ElementPlus卡片组件
- 入口: `main.ts`

### backend
- `/api/hello` GET接口返回 `{ message: "Hello from Express!" }`
- 入口: `src/index.ts`

## 5. 依赖安装

- frontend: 安装vue, element-plus, @element-plus/icons-vue
- backend: 安装express, mysql2, cors
- 双方都安装typescript及类型定义

## 6. 验收标准

- [ ] pnpm install 可成功安装所有依赖
- [ ] frontend 可通过 `pnpm run dev` 启动
- [ ] backend 可通过 `pnpm run dev` 启动
- [ ] frontend 显示示例页面
- [ ] backend /api/hello 返回示例数据
