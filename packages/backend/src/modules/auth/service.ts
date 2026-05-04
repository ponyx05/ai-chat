import { findUserByUsername, createUser, findUserById } from "./user.repository";
import { createToken, hashToken, revokeToken } from "./token.repository";
import { generateToken } from "@/utils/jwt";
import { verifyPassword } from "@/utils/password";
import { createError } from "@/middleware/errorHandler";

export async function register(username: string, password: string): Promise<{ userId: number; username: string }> {
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  if (!usernameRegex.test(username)) {
    throw createError('用户名必须为3-50字符的字母、数字或下划线', 400);
  }

  if (password.length < 6 || password.length > 20) {
    throw createError('密码必须为6-20字符', 400);
  }

  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw createError('用户名已存在', 409);
  }

  const result = await createUser(username, password);
  return { userId: result.id, username: result.username };
}

export async function login(username: string, password: string): Promise<{ token: string; expiresAt: string }> {
  const user = await findUserByUsername(username);
  if (!user) {
    throw createError('用户名或密码错误', 401);
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw createError('用户名或密码错误', 401);
  }

  const { token, expiresAt } = generateToken({ userId: user.id, tokenId: 0 });
  const tokenId = await createToken(user.id, token, expiresAt);

  const finalToken = generateToken({ userId: user.id, tokenId });

  return { token: finalToken.token, expiresAt: finalToken.expiresAt.toISOString() };
}

export async function logout(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await revokeToken(tokenHash);
}

export async function getCurrentUser(userId: number): Promise<{ userId: number; username: string; createdAt: Date }> {
  const user = await findUserById(userId);
  if (!user) {
    throw createError('用户不存在', 404);
  }
  return { userId: user.id, username: user.username, createdAt: user.createdAt };
}