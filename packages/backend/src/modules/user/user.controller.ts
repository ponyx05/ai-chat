import { Request, Response, NextFunction } from "express";
import { changePassword } from "./user.service";
import { authMiddleware } from "@/middleware/auth";
import { ApiResponse, ChangePasswordBody } from "@/types";

export async function changePasswordHandler(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> {
  try {
    const { oldPassword, newPassword } = req.body as ChangePasswordBody;
    await changePassword(req.user!.userId, oldPassword, newPassword);
    res.json({
      code: 200,
      message: "密码修改成功",
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

export { authMiddleware };