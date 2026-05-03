# AI Chat 聊天界面实现计划

## 技术栈

- **前端**: React + TypeScript + Vite
- **后端**: Node.js + Express
- **Markdown渲染**: react-markdown + remark-gfm + rehype-highlight
- **HTTP Client**: ky (或fetch)
- **样式**: CSS Modules 或 Tailwind CSS

---

## 前端组件列表

### 1. Sidebar (侧边栏容器)
- 宽度固定(约260px)或可折叠
- 包含 NewChatButton、SessionList、UserFooter
- 背景色与主内容区分

### 2. NewChatButton (新建会话按钮)
- 位于侧边栏顶部
- 点击创建新会话并切换到WelcomeView

### 3. SessionList / SessionItem (会话列表)
- 显示用户所有会话，按updatedAt降序
- 点击切换到对应会话的ChatView
- 悬停显示删除按钮
- 当前选中项高亮

### 4. UserFooter (底部用户信息)
- 显示当前用户名
- 点击展开下拉菜单（退出登录、修改密码）
- 位于侧边栏最底部

### 5. WelcomeView (新对话界面)
- 居中显示欢迎文字"准备好了，随时开始"
- 居中的MessageInput组件
- 无会话时显示此视图

### 6. ChatView (聊天主视图)
- 左侧显示Sidebar
- 右侧上方MessageList
- 右侧下方MessageInput (固定底部)
- 选中会话后显示此视图

### 7. MessageList (消息列表)
- 滚动区域，显示所有消息
- 用户消息靠右，AI消息靠左
- 新消息自动滚动到底部(可选)
- 消息之间有适当间距

### 8. MessageBubble (用户消息气泡)
- 浅灰色圆角矩形气泡
- 文字靠右
- 位于消息列表右侧

### 9. AssistantMessage (AI回复)
- 无气泡背景，直接显示文字
- 支持完整Markdown渲染（标题、列表、代码块、粗体斜体、链接、表格等）
- 代码块有语法高亮和一键复制按钮

### 10. MessageInput (输入框)
- 药丸状设计
- 左侧+号图标(预留)
- placeholder: "有问题，尽管问"
- 右侧发送按钮
- 支持多行输入
- Enter发送，Shift+Enter换行

### 11. ScrollToBottom (滚动到底部按钮)
- 当消息列表超过可视区域时显示
- 点击滚动到最新消息
- 位于消息列表右下角

---

## 后端API列表

### 1. GET /api/sessions - 获取会话列表
- 返回用户所有会话，按updatedAt降序
- 响应: `{ code: 200, data: [{ id, title, updatedAt }] }`

### 2. PUT /api/sessions/:id - 修改会话标题
- 请求: `{ title: "新标题" }`
- 响应: `{ code: 200, data: { id, title, updatedAt } }`

### 3. DELETE /api/sessions/:id - 删除会话
- 级联删除该会话所有消息
- 响应: `{ code: 200, message: "会话删除成功" }`

### 4. GET /api/sessions/:sessionId/messages - 获取会话消息
- 查询参数: cursor, limit
- 响应: `{ code: 200, data: { data: [{ id, role, content, createdAt }], pagination } }`

### 5. POST /api/messages - 发送消息(SSE流式)
- 请求: `{ sessionId?: number, content: "消息内容" }`
- SSE事件: session, message, done
- 自动创建会话(如果无sessionId)
- 首条消息截取前10字符作为标题

---

## 前端页面路由

- `/login` - 登录页
- `/chat` - 主聊天页(含Sidebar + WelcomeView/ChatView)

---

## 实现顺序

1. 后端API (因为前端依赖API)
2. 前端基础布局 (Sidebar, ChatContainer)
3. 会话管理组件 (SessionList, UserFooter)
4. 消息相关组件 (MessageBubble, AssistantMessage, MessageInput)
5. 视图整合 (WelcomeView, ChatView, ScrollToBottom)