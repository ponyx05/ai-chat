import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { dbConfig } from '../config/database.js';
import { hashPassword } from '../utils/password.js';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date | null;
}

export interface UserCreateResult {
  id: number;
  username: string;
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  } finally {
    await connection.end();
  }
}

export async function findUserById(id: number): Promise<User | null> {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  } finally {
    await connection.end();
  }
}

export async function createUser(username: string, password: string): Promise<UserCreateResult> {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const passwordHash = await hashPassword(password);
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash]
    );
    return { id: result.insertId, username };
  } finally {
    await connection.end();
  }
}

export async function updateUserPassword(userId: number, newPasswordHash: string): Promise<void> {
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, userId]
    );
  } finally {
    await connection.end();
  }
}
