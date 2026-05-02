import { Router, Request, Response, NextFunction } from "express";
import {
  getSessionList,
  updateTitle,
  removeSession,
  getSessionMessages,
  sendMessage,
} from "../services/sessionService.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  ApiResponse,
  SessionData,
  MessageData,
  SendMessageBody,
  UpdateSessionTitleBody,
  GetMessagesQuery,
  MessagesPagination,
  MessagesResponse,
} from "../types/index.js";
import { createError } from "../middleware/errorHandler.js";

const router: Router = Router();

router.get(
  "/sessions",
  authMiddleware,
  async (
    req: Request,
    res: Response<ApiResponse<SessionData[]>>,
    next: NextFunction,
  ) => {
    try {
      const sessions = await getSessionList(req.user!.userId);
      res.json({
        code: 200,
        message: "success",
        data: sessions.map((s) => ({
          id: s.id,
          title: s.title,
          updatedAt: s.updatedAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/sessions/:id",
  authMiddleware,
  async (
    req: Request,
    res: Response<ApiResponse<SessionData>>,
    next: NextFunction,
  ) => {
    try {
      const sessionId = parseInt(req.params.id);
      const { title } = req.body as UpdateSessionTitleBody;
      const session = await updateTitle(sessionId, req.user!.userId, title);
      res.json({
        code: 200,
        message: "标题修改成功",
        data: {
          id: session.id,
          title: session.title,
          updatedAt: session.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/sessions/:id",
  authMiddleware,
  async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      const sessionId = parseInt(req.params.id);
      await removeSession(sessionId, req.user!.userId);
      res.json({
        code: 200,
        message: "会话删除成功",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/sessions/:sessionId/messages",
  authMiddleware,
  async (
    req: Request,
    res: Response<ApiResponse<MessagesResponse>>,
    next: NextFunction,
  ) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const { cursor, limit } = req.query as GetMessagesQuery;

      let parsedLimit: number | undefined;
      if (limit !== undefined) {
        const numericLimit = Number(limit);
        if (!numericLimit || numericLimit < 10 || numericLimit > 20) {
          throw createError("limit 必须介于 10-20 之间", 400);
        }
        parsedLimit = numericLimit;
      }

      let parsedCursor: Date | undefined;
      if (cursor) {
        parsedCursor = new Date(cursor);
        if (isNaN(parsedCursor.getTime())) {
          throw createError("cursor 格式无效", 400);
        }
      }

      const result = await getSessionMessages(
        sessionId,
        req.user!.userId,
        parsedCursor,
        parsedLimit,
      );

      const pagination: MessagesPagination = {
        hasMore: result.pagination.hasMore,
        nextCursor: result.pagination.nextCursor,
      };

      res.json({
        code: 200,
        message: "success",
        data: {
          data: result.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            createdAt: m.createdAt,
          })),
          pagination,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/messages",
  authMiddleware,
  async (
    req: Request,
    res: Response<ApiResponse<{ sessionId: number }>>,
    next: NextFunction,
  ) => {
    try {
      const { sessionId, content } = req.body as SendMessageBody;
      const result = await sendMessage(req.user!.userId, content, sessionId);
      res.json({
        code: 200,
        message: "消息发送成功",
        data: { sessionId: result.sessionId },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
