import { Request, Response, NextFunction } from "express";
import { register, login, getCurrentUser, changePassword } from "./service";
import {
  ApiResponse,
  RegisterBody,
  LoginBody,
  RegisterResponse,
  LoginResponse,
  UserData,
  ChangePasswordBody,
} from "@/types";

export const registerHandler = async (
  req: Request,
  res: Response<ApiResponse<RegisterResponse>>,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body as RegisterBody;
    const result = await register(username, password);
    res.status(201).json({
      code: 201,
      message: "注册成功",
      data: { userId: result.userId, username: result.username },
    });
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (
  req: Request,
  res: Response<ApiResponse<LoginResponse>>,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body as LoginBody;
    const result = await login(username, password);
    res.json({
      code: 200,
      message: "登录成功",
      data: { token: result.token, expiresAt: result.expiresAt },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction,
) => {
  res.json({
    code: 200,
    message: "登出成功",
    data: null,
  });
};

export const meHandler = async (
  req: Request,
  res: Response<ApiResponse<UserData>>,
  next: NextFunction,
) => {
  try {
    const user = await getCurrentUser(req.user!.userId);
    res.json({
      code: 200,
      message: "success",
      data: {
        userId: user.userId,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export async function changePasswordHandler(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction,
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
