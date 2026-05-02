# 认证接口

---

## 1. 注册

**POST** `/api/auth/register`

**请求体**
```json
{
  "username": "string",   // 必填，3-50字符，字母数字下划线
  "password": "string"    // 必填，6-20字符
}
```

**响应成功 (201)**
```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "userId": 1,
    "username": "testuser"
  }
}
```

**响应失败 (409 - 用户名已存在)**
```json
{
  "code": 409,
  "message": "用户名已存在",
  "data": null
}
```

---

## 2. 登录

**POST** `/api/auth/login`

**请求体**
```json
{
  "username": "string",
  "password": "string"
}
```

**响应成功 (200)**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2026-05-28T00:00:00.000Z"
  }
}
```

**响应失败 (401 - 用户名或密码错误)**
```json
{
  "code": 401,
  "message": "用户名或密码错误",
  "data": null
}
```

---

## 3. 登出

**POST** `/api/auth/logout`

**Headers**
```
Authorization: Bearer <token>
```

**响应成功 (200)**
```json
{
  "code": 200,
  "message": "登出成功",
  "data": null
}
```

---

## 4. 获取当前用户信息

**GET** `/api/auth/me`

**Headers**
```
Authorization: Bearer <token>
```

**响应成功 (200)**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": 1,
    "username": "testuser",
    "createdAt": "2026-04-28T00:00:00.000Z"
  }
}
```

---

## 数据库表结构

### users 表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 用户ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| password_hash | VARCHAR(255) | NOT NULL | 密码（bcrypt） |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

### user_tokens 表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 记录ID |
| user_id | INT | FK -> users.id, NOT NULL | 用户ID |
| token_hash | VARCHAR(64) | NOT NULL | token的SHA256哈希 |
| expires_at | DATETIME | NOT NULL | 过期时间 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| revoked | BOOLEAN | DEFAULT FALSE | 是否已撤销 |