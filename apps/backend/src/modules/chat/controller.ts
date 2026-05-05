import { Request, Response, NextFunction } from "express";
import {
  getSessionList,
  updateTitle,
  removeSession,
  getSessionMessages,
  sendMessage,
} from "./service";
import {
  ApiResponse,
  SessionData,
  GetMessagesQuery,
  MessagesResponse,
} from "@/types";
import { createError } from "@/middleware/errorHandler";

export async function getSessionListHandler(
  req: Request,
  res: Response<ApiResponse<SessionData[]>>,
  next: NextFunction,
) {
  try {
    const sessions = await getSessionList(req.user!.userId);
    res.json({
      code: 200,
      message: "success",
      data: sessions.map((session) => ({
        id: session.id,
        title: session.title,
        updatedAt: session.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTitleHandler(
  req: Request,
  res: Response<ApiResponse<SessionData>>,
  next: NextFunction,
) {
  try {
    const sessionId = parseInt(req.params.id);
    const { title } = req.body as { title: string };
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
}

export async function removeSessionHandler(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction,
) {
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
}

export async function getSessionMessagesHandler(
  req: Request,
  res: Response<ApiResponse<MessagesResponse>>,
  next: NextFunction,
) {
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
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function sendMessageHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { sessionId, content } = req.body as {
      sessionId?: number;
      content: string;
    };

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const result = await sendMessage(
      req.user!.userId,
      content,
      sessionId,
      async (chunk) => {
        res.write(
          `event: message\ndata: ${JSON.stringify({ content: chunk })}\n\n`,
        );
      },
    );

    if (result.isNewSession) {
      res.write(
        `event: session\ndata: ${JSON.stringify({ sessionId: result.sessionId })}\n\n`,
      );
    }

    res.end();
  } catch (error) {
    next(error);
  }
}
