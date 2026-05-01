import crypto from "crypto";
import { prisma } from "../lib/prisma.js";

export interface Token {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
}

export function hashToken(token: string): string {
  //createHash创建一个 SHA-256 哈希器。
  //update将 token 数据输入到这个哈希器中。
  //digest计算出 token 的 SHA-256 哈希值，并将其以十六进制字符串的形式返回。
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createToken(
  userId: number,
  token: string,
  expiresAt: Date,
): Promise<number> {
  const tokenHash = hashToken(token);
  const result = await prisma.userToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });
  return result.id;
}

export async function findTokenByHash(
  tokenHash: string,
): Promise<Token | null> {
  const token = await prisma.userToken.findUnique({
    where: { tokenHash },
  });
  return token
    ? { ...token, userId: token.userId, tokenHash: token.tokenHash }
    : null;
}

export async function revokeToken(tokenHash: string): Promise<void> {
  await prisma.userToken.update({
    where: { tokenHash },
    data: { revoked: true },
  });
}

export async function revokeAllUserTokens(userId: number): Promise<void> {
  await prisma.userToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
}
