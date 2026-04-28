# API Documentation

## Base URL

```
http://localhost:4000
```

## Endpoints

### 1. Health Check

**GET** `/`

检查服务是否正常运行

**Response**

```json
{
  "message": "AI Chat Backend"
}
```

---

### 2. Hello API

**GET** `/api/hello`

示例接口

**Response**

```json
{
  "message": "Hello from Express!"
}
```

---

### 3. Database Test

**GET** `/api/db-test`

测试数据库连接

**Response Success (200)**

```json
{
  "success": true,
  "data": [{ "result": 1 }]
}
```

**Response Error (500)**

```json
{
  "success": false,
  "message": "Database connection failed"
}
```
