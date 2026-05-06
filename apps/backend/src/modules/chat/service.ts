import {
  findSessionsByUserId,
  findSessionById,
  createSession,
  updateSessionTitle,
  updateSessionUpdatedAt,
  deleteSession,
  findMessagesBySessionId,
  createMessage,
  updateMessageContent,
} from "./repository";
import { createStreamingChat, ChatMessage } from "./ai.service";
import { createError } from "@/middleware/errorHandler";

export async function getSessionList(userId: number) {
  return findSessionsByUserId(userId);
}

export async function createNewSession(userId: number, content: string) {
  const title = content.slice(0, 10);
  return createSession(userId, title);
}

export async function updateTitle(
  sessionId: number,
  userId: number,
  title: string,
) {
  const session = await findSessionById(sessionId);
  if (!session) {
    throw createError("会话不存在", 404);
  }
  if (session.userId !== userId) {
    throw createError("无权操作此会话", 403);
  }
  return updateSessionTitle(sessionId, title);
}

export async function removeSession(sessionId: number, userId: number) {
  const session = await findSessionById(sessionId);
  if (!session) {
    throw createError("会话不存在", 404);
  }
  if (session.userId !== userId) {
    throw createError("无权操作此会话", 403);
  }
  await deleteSession(sessionId);
}

export async function getSessionMessages(sessionId: number, userId: number) {
  const session = await findSessionById(sessionId);
  if (!session) {
    throw createError("会话不存在", 404);
  }
  if (session.userId !== userId) {
    throw createError("无权操作此会话", 403);
  }
  const { messages } = await findMessagesBySessionId(sessionId);

  return { messages };
}

export async function sendMessage(
  userId: number,
  content: string,
  sessionId: number | undefined,
  onChunk: (content: string) => Promise<void>,
): Promise<{
  sessionId: number;
  assistantMessageId?: number;
}> {
  if (sessionId) {
    const session = await findSessionById(sessionId);
    if (!session || session.userId !== userId) {
      sessionId = undefined;
    }
  }

  if (!sessionId) {
    const title = content.slice(0, 10);
    const session = await createSession(userId, title);
    sessionId = session.id;
  }

  await createMessage(sessionId, "user", content);

  const { messages: historyMessages } =
    await findMessagesBySessionId(sessionId);

  const aiMessages: ChatMessage[] = historyMessages.map((message) => ({
    role: message.role,
    content: message.content,
    name: message.role === "user" ? "用户" : "MiniMax AI",
  }));

  const stream = await createStreamingChat(aiMessages);
  const assistantMessage = await createMessage(sessionId, "assistant", "");
  const chunks: string[] = [];

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      chunks.push(content);
      await onChunk(content);
    }
  }

  await updateMessageContent(assistantMessage.id, chunks.join(""));
  await updateSessionUpdatedAt(sessionId);

  return {
    sessionId,
    assistantMessageId: assistantMessage.id,
  };
}
