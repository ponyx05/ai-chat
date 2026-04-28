# Frontend

前端子工程，基于 Vue3 + ElementPlus + TypeScript + Vite

## 技术栈

- **构建工具**: Vite 6
- **框架**: Vue 3
- **UI 组件库**: ElementPlus
- **图标库**: @element-plus/icons-vue
- **语言**: TypeScript

## 目录结构

```
frontend/
├── index.html              # HTML 入口
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── tsconfig.node.json      # TypeScript 节点配置
├── vite.config.ts          # Vite 配置
└── src/
    ├── main.ts              # 入口文件
    ├── App.vue              # 根组件
    ├── env.d.ts             # Vue 类型声明
    └── components/
        └── HelloWorld.vue   # 示例组件
```

## 开发命令

```bash
# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 注意事项

- 开发服务器默认运行在 http://localhost:3000
- API 请求已配置代理到后端 /api/\*
