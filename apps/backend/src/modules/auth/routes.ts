import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  meHandler,
  changePasswordHandler,
  authMiddleware,
} from "./controller";

const router: Router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/me", authMiddleware, meHandler);
router.put("/password", authMiddleware, changePasswordHandler);

export default router;
