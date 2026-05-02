import {
  findSessionsByUserId,
  findSessionById,
  createSession,
  updateSessionTitle,
  updateSessionUpdatedAt,
  deleteSession,
  findMessagesBySessionId,
  createMessage,
  findMessagesCountBySessionId,
} from '../models/session.js';
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
  sessionId?: number,
) {
  let currentSessionId = sessionId;

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
  }

  await createMessage(currentSessionId, 'user', content);

  const count = await findMessagesCountBySessionId(currentSessionId);
  if (count === 1) {
    const title = content.slice(0, 10);
    await updateSessionTitle(currentSessionId, title);
  }

  await updateSessionUpdatedAt(currentSessionId);

  return { sessionId: currentSessionId };
}