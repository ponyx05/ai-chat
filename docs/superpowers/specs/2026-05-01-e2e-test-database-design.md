# E2E 测试数据库管理设计

## 背景

当前 `setupTests.ts` 使用手写 SQL 创建表结构，与 `schema.prisma` 容易不同步。需要改用 Prisma Migrate 管理表结构。

## 目标

- 测试开始时创建干净的测试数据库和表结构
- 测试结束后清理测试数据库
- 通过 `getPrismaForTest()` 获取 Prisma Client 操作测试数据库
- Jest 配置确保 models 模块加载时使用 test client

## 方案

### 1. 环境变量配置

通过 Jest `setupFiles` 在加载模块前设置环境变量：

```javascript
// jest.config.js 或 jest.setup.js
process.env.TEST_DATABASE_NAME = 'ai_chat_test';
```

models 模块加载时，`getPrisma()` 检测到 `TEST_DATABASE_NAME` 存在，返回 test client。

### 2. setupTests.ts

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const DB_HOST = process.env.DATABASE_HOST || 'localhost';
const DB_PORT = Number(process.env.DATABASE_PORT) || 3306;
const DB_USER = process.env.DATABASE_USER || 'root';
const DB_PASSWORD = process.env.DATABASE_PASSWORD || '123456';
const DB_NAME = process.env.TEST_DATABASE_NAME || 'ai_chat_test';

export async function setupTestDatabase() {
  // 1. mysql CLI 创建测试数据库（如果不存在）
  await execAsync(
    `mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME}"`
  );

  // 2. Prisma Migrate deploy 创建表结构
  const dbUrl = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  await execAsync('npx prisma migrate deploy', {
    cwd: path.resolve(__dirname, '../../'),
    env: { ...process.env, DATABASE_URL: dbUrl },
  });
}

export async function teardownTestDatabase() {
  // mysql CLI 删除测试数据库
  await execAsync(
    `mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} -e "DROP DATABASE IF EXISTS ${DB_NAME}"`
  );
}
```

### 3. Prisma Client 获取

`getPrisma()` 内部逻辑保持不变：

```typescript
export function getPrisma(): PrismaClient {
  if (process.env.TEST_DATABASE_NAME) {
    return getPrismaForTest();
  }
  // ... production client
}
```

models 模块调用 `getPrisma()` 时会根据环境变量自动获取对应 client。

### 4. Jest 配置

```javascript
// jest.config.js
module.exports = {
  setupFiles: ['<rootDir>/src/e2e/jest.setup.js'],
};
```

```javascript
// jest.setup.js
process.env.TEST_DATABASE_NAME = 'ai_chat_test';
```

## 流程

```
beforeAll:
  1. jest.setup.js 设置环境变量
  2. models 模块加载，getPrisma() 返回 test client
  3. setupTestDatabase() → 创建测试数据库 + migrate deploy

测试运行:
  - 使用 test client 连接测试数据库

afterAll:
  - teardownTestDatabase() → 删除测试数据库
```

## 改动点

1. `packages/backend/src/e2e/setupTests.ts` - 重写为 mysql CLI + prisma migrate deploy
2. `packages/backend/src/e2e/jest.setup.js` - 新建，设置环境变量
3. `packages/backend/jest.config.js` - 添加 setupFiles 配置（如无则新建）

## 前提条件

- 需要先运行 `prisma migrate dev` 生成初始 migration（一次性）
- 测试数据库连接信息通过环境变量或默认值获取