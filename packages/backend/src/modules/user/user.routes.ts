import { Router } from "express";
import { changePasswordHandler, authMiddleware } from "./user.controller";

const router: Router = Router();

router.put("/password", authMiddleware, changePasswordHandler);

export default router;
