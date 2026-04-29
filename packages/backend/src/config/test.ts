export const testDbConfig = {
  host: process.env.TEST_DB_HOST || "localhost",
  port: Number(process.env.TEST_DB_PORT) || 3306,
  user: process.env.TEST_DB_USER || "root",
  password: process.env.TEST_DB_PASSWORD || "123456",
  database: process.env.TEST_DB_NAME || "ai_chat_test",
};