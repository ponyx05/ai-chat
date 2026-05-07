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
apps/frontend/
├── index.html              # HTML 入口
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── tsconfig.node.json      # TypeScript 节点配置
├── vite.config.ts          # Vite 配置
└── src/
    ├── main.ts              # 入口文件
    ├── App.vue              # 根组件
    ├── env.d.ts             # Vue 类型声明
    ├── eventBus.ts          # 事件总线
    ├── apis/                # API 接口层
    │   ├── request.ts       # axios 封装
    │   ├── auth.ts          # 认证 API
    │   ├── user.ts          # 用户 API
    │   └── index.ts         # 统一导出
    ├── components/          # 公共组件
    │   ├── ErrorProvider.vue # 全局错误处理
    │   └── chat/             # 聊天组件（11个）
    │       ├── index.ts           # 统一导出
    │       ├── AssistantMessage.vue  # AI 消息气泡
    │       ├── ChatView.vue       # 主聊天视图
    │       ├── MessageBubble.vue  # 用户消息气泡
    │       ├── MessageInput.vue   # 消息输入框
    │       ├── NewChatButton.vue  # 新建聊天按钮
    │       ├── ScrollToBottom.vue # 滚动到底部
    │       ├── SessionItem.vue    # 会话项
    │       ├── SessionList.vue    # 会话列表
    │       ├── Sidebar.vue        # 侧边栏
    │       ├── UserFooter.vue     # 用户底部组件（含修改密码弹框）
    │       └── WelcomeView.vue    # 欢迎页
    ├── pages/               # 页面组件
    │   ├── Login.vue        # 登录页
    │   ├── Register.vue     # 注册页
    │   └── Home.vue         # 首页
    ├── router/              # 路由配置
    │   └── index.ts         # 路由配置 + 守卫
    ├── store/               # 状态管理
    │   ├── auth.ts          # 认证状态管理
    │   ├── chat.ts          # 聊天状态管理
    │   └── index.ts         # 统一导出
    ├── types/              # 类型定义
    │   └── chat.ts          # 聊天相关类型
    └── utils/               # 工具函数
        ├── storage.ts       # 本地存储工具
        └── index.ts         # 统一导出
```

## 注意事项

- 开发服务器默认运行在 http://localhost:3000
- API 请求已配置代理到后端 /api/\*
- 路由守卫：未登录自动跳转登录页
- Token 存储在 localStorage
