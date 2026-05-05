import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  changePasswordHandler,
} from "./controller";
import { authMiddleware } from "@/middleware/auth";

const router: Router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/logout", authMiddleware, logoutHandler);
router.get("/me", authMiddleware, meHandler);
router.put("/password", authMiddleware, changePasswordHandler);

export default router;
