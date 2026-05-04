import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/password";

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export interface UserCreateResult {
  id: number;
  username: string;
}

export async function findUserByUsername(
  username: string,
): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user ? { ...user, passwordHash: user.passwordHash } : null;
}

export async function findUserById(id: number): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user ? { ...user, passwordHash: user.passwordHash } : null;
}

export async function createUser(
  username: string,
  password: string,
): Promise<UserCreateResult> {
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { username, passwordHash },
  });
  return { id: user.id, username: user.username };
}

export async function updateUserPassword(
  userId: number,
  newPasswordHash: string,
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });
}