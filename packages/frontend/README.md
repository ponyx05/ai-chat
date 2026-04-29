# Frontend

前端子工程，基于 Vue3 + Ant Design Vue + TypeScript + Vite

## 技术栈

- **构建工具**: Vite 6
- **框架**: Vue 3
- **UI 组件库**: Ant Design Vue 4
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **语言**: TypeScript

## 目录结构

```
packages/frontend/
├── index.html              # HTML 入口
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── tsconfig.node.json      # TypeScript 节点配置
├── vite.config.ts          # Vite 配置
└── src/
    ├── main.ts              # 入口文件
    ├── App.vue              # 根组件
    ├── env.d.ts             # Vue 类型声明
    ├── apis/
    │   ├── request.ts      # axios 封装
    │   ├── auth.ts         # 认证 API
    │   ├── user.ts         # 用户 API
    │   └── index.ts        # 统一导出
    ├── components/
    │   └── HelloWorld.vue   # 示例组件
    ├── pages/
    │   ├── Login.vue       # 登录页
    │   ├── Register.vue    # 注册页
    │   ├── Home.vue        # 首页
    │   └── ChangePassword.vue  # 修改密码页
    ├── router/
    │   └── index.ts        # 路由配置 + 守卫
    ├── store/
    │   ├── auth.ts         # 认证状态管理
    │   └── index.ts        # 统一导出
    └── utils/
        ├── storage.ts      # 本地存储工具
        └── index.ts        # 统一导出
```

## 开发命令

```bash
# 开发模式 (热重载)
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 注意事项

- 开发服务器默认运行在 http://localhost:3000
- API 请求已配置代理到后端 /api/*
- 路由守卫：未登录自动跳转登录页
- Token 存储在 localStorage
