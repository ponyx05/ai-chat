import mysql from 'mysql2/promise';
import { testDbConfig } from '../config/test';
import { getDbConfig } from '../config/database.js';

process.env.DB_NAME = testDbConfig.database;

let connection: mysql.Connection | null = null;

export async function setupTestDatabase() {
  connection = await mysql.createConnection({
    host: testDbConfig.host,
    port: testDbConfig.port,
    user: testDbConfig.user,
    password: testDbConfig.password,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${testDbConfig.database}\``);
  await connection.end();
  connection = null;

  const dbCfg = getDbConfig();
  const setupConn = await mysql.createConnection(dbCfg);
  await setupConn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await setupConn.query(`
    CREATE TABLE IF NOT EXISTS user_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token_hash VARCHAR(64) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      revoked BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await setupConn.end();
}

export async function teardownTestDatabase() {
  connection = await mysql.createConnection({
    host: testDbConfig.host,
    port: testDbConfig.port,
    user: testDbConfig.user,
    password: testDbConfig.password,
  });

  await connection.query(`DROP DATABASE IF EXISTS \`${testDbConfig.database}\``);
  await connection.end();
  connection = null;
}