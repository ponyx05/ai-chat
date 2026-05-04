import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export interface Token {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
}

export function hashToken(token: string): string {
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
  await prisma.userToken.updateMany({
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