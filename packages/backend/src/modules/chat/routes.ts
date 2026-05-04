import { Router } from "express";
import { authMiddleware } from "@/middleware/auth";
import {
  getSessionListHandler,
  updateTitleHandler,
  removeSessionHandler,
  getSessionMessagesHandler,
  sendMessageHandler,
} from "./controller";

const router: Router = Router();

router.get("/chat/sessions", authMiddleware, getSessionListHandler);

router.put("/chat/sessions/:id", authMiddleware, updateTitleHandler);

router.delete("/chat/sessions/:id", authMiddleware, removeSessionHandler);

router.get(
  "/chat/sessions/:sessionId/messages",
  authMiddleware,
  getSessionMessagesHandler,
);

router.post("/chat/messages", authMiddleware, sendMessageHandler);

export default router;
