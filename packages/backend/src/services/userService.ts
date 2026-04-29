import { findUserById, updateUserPassword } from '../models/user.js';
import { verifyPassword, hashPassword } from '../utils/password.js';
import { createError } from '../middleware/errorHandler.js';

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

  const isValid = await verifyPassword(oldPassword, user.password_hash);
  if (!isValid) {
    throw createError('当前密码错误', 401);
  }

  const newPasswordHash = await hashPassword(newPassword);
  await updateUserPassword(userId, newPasswordHash);
}
