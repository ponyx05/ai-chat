# Chat API

## 发送消息

发送消息并以 SSE 流式返回 AI 回复。

### 请求

```
POST /api/chat/messages
Content-Type: application/json
Authorization: Bearer <token>
```

### 请求体

```json
{
  "sessionId": 1,       // 可选，会话 ID，不提供则创建新会话
  "content": "你好"     // 必填，消息内容
}
```

### 响应

SSE 流式响应，每个 chunk 格式：

```
event: message
data: {"content": "你好"}

event: message
data: {"content": "，"}

event: session
data: {"sessionId": 1}   // 仅新会话时发送

event: done
data: {"id": 123}         // 包含 assistant message ID
```

### 事件类型

| 事件名 | 说明 |
|--------|------|
| `message` | AI 回复片段，包含 `content` 字段 |
| `session` | 新会话创建时返回，包含 `sessionId` |
| `done` | 消息发送完成，包含 `id`（assistant message ID） |
