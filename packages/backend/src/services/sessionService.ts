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
  findMessagesCountBySessionId,
} from '../models/session.js';
import { createStreamingChat, ChatMessage } from './aiService.js';
import { createError } from '../middleware/errorHandler.js';

export async function getSessionList(userId: number) {
  return findSessionsByUserId(userId);
}

export async function updateTitle(sessionId: number, userId: number, title: string) {
  const session = await findSessionById(sessionId);
  if (!session) {
    throw createError('会话不存在', 404);
  }
  if (session.userId !== userId) {
    throw createError('无权操作此会话', 403);
  }
  return updateSessionTitle(sessionId, title);
}

export async function removeSession(sessionId: number, userId: number) {
  const session = await findSessionById(sessionId);
  if (!session) {
    throw createError('会话不存在', 404);
  }
  if (session.userId !== userId) {
    throw createError('无权操作此会话', 403);
  }
  await deleteSession(sessionId);
}

export async function getSessionMessages(
  sessionId: number,
  userId: number,
  cursor?: Date,
  limit?: number,
) {
  const session = await findSessionById(sessionId);
  if (!session) {
    throw createError('会话不存在', 404);
  }
  if (session.userId !== userId) {
    throw createError('无权操作此会话', 403);
  }
  const { messages, hasMore } = await findMessagesBySessionId(sessionId, cursor, limit);
  const nextCursor = hasMore && messages.length > 0
    ? messages[messages.length - 1].createdAt.toISOString()
    : null;
  return { messages, pagination: { hasMore, nextCursor } };
}

export async function sendMessage(
  userId: number,
  content: string,
  sessionId: number | undefined,
  onChunk: (content: string) => Promise<void>,
): Promise<{ sessionId: number; isNewSession: boolean; assistantMessageId?: number }> {
  let currentSessionId = sessionId;
  let isNewSession = false;

  if (currentSessionId) {
    const session = await findSessionById(currentSessionId);
    if (!session || session.userId !== userId) {
      currentSessionId = undefined;
    }
  }

  if (!currentSessionId) {
    const title = content.slice(0, 10);
    const session = await createSession(userId, title);
    currentSessionId = session.id;
    isNewSession = true;
  }

  await createMessage(currentSessionId, 'user', content);

  const count = await findMessagesCountBySessionId(currentSessionId);
  if (count === 1) {
    const title = content.slice(0, 10);
    await updateSessionTitle(currentSessionId, title);
  }

  const { messages: historyMessages } = await findMessagesBySessionId(currentSessionId);
  const aiMessages: ChatMessage[] = historyMessages.map(m => ({
    role: m.role,
    content: m.content,
    name: m.role === 'user' ? '用户' : undefined,
  }));

  const stream = await createStreamingChat(aiMessages);
  const assistantMessage = await createMessage(currentSessionId, 'assistant', '');
  const chunks: string[] = [];

  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = new TextDecoder().decode(value);
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.content) {
            chunks.push(data.content);
            await onChunk(data.content);
          }
        } catch {}
      }
    }
  }

  await updateMessageContent(assistantMessage.id, chunks.join(''));
  await updateSessionUpdatedAt(currentSessionId);

  return { sessionId: currentSessionId, isNewSession, assistantMessageId: assistantMessage.id };
}