# 聊天接口

---

## 1. 获取会话列表

**GET** `/api/sessions`

**Headers**
```
Authorization: Bearer <token>
```

**响应成功 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "你好，请帮我",
      "updatedAt": "2026-04-30T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "第二个会话的标题",
      "updatedAt": "2026-04-29T08:30:00.000Z"
    }
  ]
}
```

> 按 `updated_at` 降序排列

---

## 2. 修改会话标题

**PUT** `/api/sessions/:id`

**Headers**
```
Authorization: Bearer <token>
```

**请求体**
```json
{
  "title": "新的标题"
}
```

**响应成功 (200)**
```json
{
  "code": 200,
  "message": "标题修改成功",
  "data": {
    "id": 1,
    "title": "新的标题",
    "updatedAt": "2026-04-29T08:30:00.000Z"
  }
}
```

> 修改标题不更新 `updated_at`

---

## 3. 删除会话

**DELETE** `/api/sessions/:id`

**Headers**
```
Authorization: Bearer <token>
```

**响应成功 (200)**
```json
{
  "code": 200,
  "message": "会话删除成功",
  "data": null
}
```

> 级联删除该会话的所有消息

---

## 4. 获取会话消息

**GET** `/api/sessions/:sessionId/messages`

**Headers**
```
Authorization: Bearer <token>
```

**查询参数**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cursor | string | 否 | 分页游标，值为上页最后一条消息的 `createdAt` |
| limit | number | 否 | 每页消息数，范围 10-20，默认 20 |

**响应成功 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "role": "user",
        "content": "你好，请帮我写一段代码",
        "createdAt": "2026-04-30T10:00:00.000Z"
      },
      {
        "id": 2,
        "role": "assistant",
        "content": "好的，请问你想写什么代码？",
        "createdAt": "2026-04-30T10:00:05.000Z"
      }
    ],
    "pagination": {
      "hasMore": true,
      "nextCursor": "2026-04-30T09:00:00.000Z"
    }
  }
}
```

> 按 `created_at` 升序排列，首次请求不传 cursor 返回最新消息

---

## 5. 发送消息

**POST** `/api/messages`

**Headers**
```
Authorization: Bearer <token>
```

**请求体**
```json
{
  "sessionId": 1  // 可选，不传或无效则自动创建会话
}
```

**响应** (SSE 流式)

```
event: session
data: {"sessionId": 1}

event: message
data: {"id": 2, "content": "好的"}

event: message
data: {"id": 2, "content": "，请问"}

event: message
data: {"id": 2, "content": "你想"}

event: message
data: {"id": 2, "content": "写什么代码？"}

event: done
data: {"id": 2, "createdAt": "2026-04-30T10:00:05.000Z"}
```

**字段说明：**
- `event: session` — 会话信息，仅自动创建时返回
- `event: message` — AI 回复片段，前端拼接 `content`
- `event: done` — 结束信号，包含最终 `id` 和 `createdAt`

**处理逻辑：**
1. 若 `sessionId` 不传或无效，自动创建新会话
2. 保存用户消息（`role: user`）
3. 若为会话首条消息，从内容截取前 10 字符作为标题
4. 创建 message 记录（content 初始为空）
5. 开启 SSE 流式推送 AI 回复片段
6. 收到 AI 完整回复后更新 message.content
7. 更新会话 `updated_at`

---

## 数据库表结构

### sessions 表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 会话ID |
| user_id | INT | FK -> users.id, NOT NULL | 所属用户 |
| title | VARCHAR(255) | NOT NULL | 标题（发送首条消息后生成） |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | DATETIME | ON UPDATE CURRENT_TIMESTAMP | 最后活跃时间（仅消息发送时更新） |

### messages 表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 消息ID |
| session_id | INT | FK -> sessions.id, ON DELETE CASCADE | 所属会话 |
| role | ENUM('user', 'assistant') | NOT NULL | 发送方角色 |
| content | TEXT | NOT NULL | 消息内容 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |