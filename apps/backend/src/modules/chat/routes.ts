import { Router } from "express";
import { authMiddleware } from "@/middleware/auth";
import {
  getSessionListHandler,
  createSessionHandler,
  updateTitleHandler,
  removeSessionHandler,
  getSessionMessagesHandler,
  sendMessageHandler,
} from "./controller";

const router: Router = Router();
router.use(authMiddleware);

router.get("/chat/sessions", getSessionListHandler);
router.post("/chat/sessions", createSessionHandler);
router.put("/chat/sessions/:id", updateTitleHandler);
router.delete("/chat/sessions/:id", removeSessionHandler);
router.get("/chat/sessions/:sessionId/messages", getSessionMessagesHandler);
router.post("/chat/messages", sendMessageHandler);

export default router;
