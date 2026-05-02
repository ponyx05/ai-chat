# Frontend

前端子工程，基于 Vue3 + Ant Design Vue + TypeScript + Vite 构建的 AI 聊天应用前端。

## 技术栈

| 技术             | 说明           |
| ---------------- | -------------- |
| Vite 6           | 构建工具       |
| Vue 3            | 渐进式前端框架 |
| Ant Design Vue 4 | UI 组件库      |
| Pinia            | 状态管理       |
| Vue Router       | 路由管理       |
| Axios            | HTTP 客户端    |
| TypeScript       | 类型安全       |

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
    ├── apis/                # API 接口层
    │   ├── request.ts       # axios 封装
    │   ├── auth.ts          # 认证 API
    │   ├── user.ts          # 用户 API
    │   └── index.ts         # 统一导出
    ├── components/          # 公共组件
    │   └── HelloWorld.vue   # 示例组件
    ├── pages/               # 页面组件
    │   ├── Login.vue        # 登录页
    │   ├── Register.vue     # 注册页
    │   ├── Home.vue         # 首页
    │   └── ChangePassword.vue  # 修改密码页
    ├── router/              # 路由配置
    │   └── index.ts         # 路由配置 + 守卫
    ├── store/               # 状态管理
    │   ├── auth.ts          # 认证状态管理
    │   └── index.ts         # 统一导出
    └── utils/               # 工具函数
        ├── storage.ts       # 本地存储工具
        └── index.ts         # 统一导出
```

## 注意事项

- 开发服务器默认运行在 http://localhost:3000
- API 请求已配置代理到后端 /api/\*
- 路由守卫：未登录自动跳转登录页
- Token 存储在 localStorage
