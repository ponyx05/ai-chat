import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  authMiddleware,
} from "./controller";

const router: Router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/logout", authMiddleware, logoutHandler);
router.get("/me", authMiddleware, meHandler);

export default router;
