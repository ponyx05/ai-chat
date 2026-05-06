import { Request, Response, NextFunction } from "express";
import {
  getSessionList,
  createNewSession,
  updateTitle,
  removeSession,
  getSessionMessages,
  sendMessage,
} from "./service";
import { ApiResponse } from "@/types/api-response";
import {
  SessionData,
  GetMessagesQuery,
  MessagesResponse,
} from "@/modules/chat/types/chat";
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

export async function createSessionHandler(
  req: Request,
  res: Response<ApiResponse<SessionData>>,
  next: NextFunction,
) {
  try {
    const { content } = req.body as { content: string };
    const session = await createNewSession(req.user!.userId, content);
    res.json({
      code: 200,
      message: "会话创建成功",
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
    const sessionId = +req.params.sessionId;
    const result = await getSessionMessages(sessionId, req.user!.userId);
    res.json({
      code: 200,
      message: "success",
      data: {
        data: result.messages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          createdAt: message.createdAt,
        })),
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

    await sendMessage(req.user!.userId, content, sessionId, async (chunk) => {
      res.write(
        `event: message\ndata: ${JSON.stringify({ content: chunk })}\n\n`,
      );
    });

    res.end();
  } catch (error) {
    next(error);
  }
}
