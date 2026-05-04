import { findUserById, updateUserPassword } from "@/modules/auth/user.repository";
import { verifyPassword, hashPassword } from "@/utils/password";
import { createError } from "@/middleware/errorHandler";

export async function changePassword(
  userId: number,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  if (newPassword.length < 6 || newPassword.length > 20) {
    throw createError('新密码必须为6-20字符', 400);
  }

  const user = await findUserById(userId);
  if (!user) {
    throw createError('用户不存在', 404);
  }

  const isValid = await verifyPassword(oldPassword, user.passwordHash);
  if (!isValid) {
    throw createError('当前密码错误', 401);
  }

  const newPasswordHash = await hashPassword(newPassword);
  await updateUserPassword(userId, newPasswordHash);
}