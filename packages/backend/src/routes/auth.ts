import { Router, Request, Response, NextFunction } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../services/authService.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  ApiResponse,
  RegisterBody,
  LoginBody,
  RegisterResponse,
  LoginResponse,
  UserData,
} from "../types/index.js";

const router: Router = Router();

router.post(
  "/register",
  async (
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
  },
);

router.post(
  "/login",
  async (
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
  },
);

router.post(
  "/logout",
  authMiddleware,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.substring(7);
      if (token) {
        await logout(token);
      }
      res.json({
        code: 200,
        message: "登出成功",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/me",
  authMiddleware,
  async (
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
  },
);

export default router;
