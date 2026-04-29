import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import crypto from 'crypto';
import { dbConfig } from '../config/database.js';

export interface Token {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  revoked: boolean;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createToken(userId: number, token: string, expiresAt: Date): Promise<number> {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const tokenHash = hashToken(token);
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO user_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [userId, tokenHash, expiresAt]
    );
    return result.insertId;
  } finally {
    await connection.end();
  }
}

export async function findTokenByHash(tokenHash: string): Promise<Token | null> {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM user_tokens WHERE token_hash = ?',
      [tokenHash]
    );
    return rows.length > 0 ? (rows[0] as Token) : null;
  } finally {
    await connection.end();
  }
}

export async function revokeToken(tokenHash: string): Promise<void> {
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.execute(
      'UPDATE user_tokens SET revoked = TRUE WHERE token_hash = ?',
      [tokenHash]
    );
  } finally {
    await connection.end();
  }
}

export async function revokeAllUserTokens(userId: number): Promise<void> {
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.execute(
      'UPDATE user_tokens SET revoked = TRUE WHERE user_id = ?',
      [userId]
    );
  } finally {
    await connection.end();
  }
}
