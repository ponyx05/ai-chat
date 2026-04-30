# API 文档

## 目录

- [认证接口](./auth.md) - 注册、登录、登出、获取用户信息
- [聊天接口](./chat.md) - 发送消息、获取会话列表、管理会话

---

## 统一接口规范

### 请求格式

**Headers**
```
Content-Type: application/json
Authorization: Bearer <token>  // 仅需要认证的接口
```

**请求体**
```json
{
  "key": "value"
}
```

### 响应格式

**成功**
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

**失败**
```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

### 状态码

| code | 说明 |
|------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或token无效 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如用户名已存在） |
| 500 | 服务器内部错误 |