import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt";
import { ApiResponse } from "@/types/api-response";

export function authMiddleware(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      code: 401,
      message: "未登录或token无效",
      data: null,
    });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      code: 401,
      message: "token无效或已过期",
      data: null,
    });
  }
}
