# E2E 测试数据库管理实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构 E2E 测试数据库管理，使用 mysql CLI 创建/删除数据库，Prisma Migrate 管理表结构

**Architecture:** 通过 mysql CLI 管理测试数据库生命周期，Prisma Migrate deploy 根据 schema.prisma 创建表结构。Jest setupFiles 在模块加载前设置环境变量，确保 models 使用正确的 test client。

**Tech Stack:** Jest, Prisma Migrate, mysql CLI, child_process

---

## 文件清单

- 修改: `packages/backend/src/e2e/setupTests.ts` - 重写数据库创建/删除逻辑
- 创建: `packages/backend/src/e2e/jest.setup.js` - Jest 初始化文件，设置环境变量
- 创建/修改: `packages/backend/jest.config.js` - 添加 setupFiles 配置

---

## Task 1: 重写 setupTests.ts

**Files:**
- Modify: `packages/backend/src/e2e/setupTests.ts`

- [ ] **Step 1: 编写新的 setupTests.ts**

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const DB_HOST = process.env.DATABASE_HOST || 'localhost';
const DB_PORT = Number(process.env.DATABASE_PORT) || 3306;
const DB_USER = process.env.DATABASE_USER || 'root';
const DB_PASSWORD = process.env.DATABASE_PASSWORD || '123456';
const DB_NAME = process.env.TEST_DATABASE_NAME || 'ai_chat_test';

export async function setupTestDatabase() {
  // 1. mysql CLI 创建测试数据库（如果不存在）
  const createDbCmd = `mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`"`;
  await execAsync(createDbCmd);

  // 2. Prisma Migrate deploy 创建表结构
  const dbUrl = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  await execAsync('npx prisma migrate deploy', {
    cwd: path.resolve(__dirname, '../../'),
    env: { ...process.env, DATABASE_URL: dbUrl },
  });
}

export async function teardownTestDatabase() {
  // mysql CLI 删除测试数据库
  const dropDbCmd = `mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASSWORD} -e "DROP DATABASE IF EXISTS \`${DB_NAME}\`"`;
  await execAsync(dropDbCmd);
}
```

- [ ] **Step 2: 提交**

```bash
cd packages/backend && git add src/e2e/setupTests.ts && git commit -m "refactor(e2e): rewrite setupTests with mysql cli + prisma migrate deploy"
```

---

## Task 2: 创建 jest.setup.js

**Files:**
- Create: `packages/backend/src/e2e/jest.setup.js`

- [ ] **Step 1: 编写 jest.setup.js**

```javascript
process.env.TEST_DATABASE_NAME = 'ai_chat_test';
```

- [ ] **Step 2: 提交**

```bash
cd packages/backend && git add src/e2e/jest.setup.js && git commit -m "feat(e2e): add jest.setup.js to set test env vars"
```

---

## Task 3: 配置 Jest

**Files:**
- Create: `packages/backend/jest.config.js`

- [ ] **Step 1: 编写 jest.config.js**

```javascript
export default {
  setupFiles: ['<rootDir>/src/e2e/jest.setup.js'],
  testMatch: ['**/src/e2e/**/*.test.ts'],
  timeout: 30000,
};
```

- [ ] **Step 2: 提交**

```bash
cd packages/backend && git add jest.config.js && git commit -m "feat(e2e): add jest.config.js with setupFiles"
```

---

## Task 4: 验证

- [ ] **Step 1: 运行 E2E 测试验证**

```bash
cd packages/backend && pnpm test
```

预期：测试通过，数据库创建/删除正常

---

## 验证清单

- [ ] setupTests.ts 不再使用手写 SQL 创建表
- [ ] jest.setup.js 在模块加载前设置 TEST_DATABASE_NAME
- [ ] jest.config.js 配置 setupFiles
- [ ] E2E 测试通过