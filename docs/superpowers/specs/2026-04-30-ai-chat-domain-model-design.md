# AI Chat 领域模型设计

## 1. 概述

这是一个 AI 聊天功能 MVP 版本，支持文本消息，不支持多模态、编辑和撤回。

## 2. 实体设计

### 2.1 Session（会话）

| 字段       | 类型   | 说明                                              |
| ---------- | ------ | ------------------------------------------------- |
| id         | number | 主键，自增                                        |
| user_id    | number | 所属用户 ID，外键（不在本项目设计）              |
| title      | string | 自动生成，用户可自行修改                          |
| created_at | Date   | 创建时间                                          |
| updated_at | Date   | 最后活跃时间（仅新消息时更新，修改 title 不影响） |

**行为：**

- 删除时级联硬删除所有关联消息
- 排序：按 `updated_at` 降序

### 2.2 Message（消息）

| 字段       | 类型                  | 说明                   |
| ---------- | --------------------- | ---------------------- |
| id         | number                | 主键，自增             |
| session_id | number                | 所属会话 ID，外键      |
| role       | 'user' \| 'assistant' | 发送方角色             |
| content    | string                | 文本内容               |
| created_at | Date                  | 创建时间，用于消息排序 |

**约束：**

- 仅支持文本，不支持多模态/编辑/撤回/删除
- 排序：按 `created_at` 升序

## 3. 关系

```
User 1 ───< Session 1 ───< Message
```

- 一个用户拥有多个会话
- 一个会话包含多条消息
- 消息按 `created_at` 升序排列

## 4. 标题生成规则

会话创建时：

1. 取用户发送的第一条消息内容
2. 截取前 10 个字符作为标题
3. 若消息不足 10 字符，则直接使用全部内容

标题生成后，用户可自行修改。修改 title 不影响会话的 `updated_at`。

## 5. 表结构（MySQL）

### sessions

```sql
CREATE TABLE sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### messages

```sql
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);
```

## 6. TODO

- [x] 设计领域模型
- [x] 实现 Prisma Schema
- [x] 实现 API 路由和服务层
- [ ] 实现 AI 集成（消息发送和流式响应）
