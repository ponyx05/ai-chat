import { Router, Request, Response, NextFunction } from "express";
import { changePassword } from "../services/userService.js";
import { authMiddleware } from "../middleware/auth.js";
import { ApiResponse, ChangePasswordBody } from "../types/index.js";

const router: Router = Router(); //Router既是一个函数也是一个类型声明，命名可重复。函数属于express，类型声明属于.d.ts文件

router.put(
  "/password",
  authMiddleware,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
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
  },
);

export default router;
