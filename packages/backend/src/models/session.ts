import { prisma } from "../lib/prisma.js";

export interface Session {
  id: number;
  userId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: number;
  sessionId: number;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export async function findSessionsByUserId(userId: number): Promise<Session[]> {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return sessions.map((session) => ({
    id: session.id,
    userId: session.userId,
    title: session.title,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  }));
}

export async function findSessionById(id: number): Promise<Session | null> {
  const session = await prisma.session.findUnique({
    where: { id },
  });
  if (!session) return null;
  return {
    id: session.id,
    userId: session.userId,
    title: session.title,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export async function createSession(
  userId: number,
  title: string,
): Promise<Session> {
  const session = await prisma.session.create({
    data: { userId, title },
  });
  return {
    id: session.id,
    userId: session.userId,
    title: session.title,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export async function updateSessionTitle(
  id: number,
  title: string,
): Promise<Session> {
  const session = await prisma.session.update({
    where: { id },
    data: { title },
  });
  return {
    id: session.id,
    userId: session.userId,
    title: session.title,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export async function updateSessionUpdatedAt(id: number): Promise<Session> {
  const session = await prisma.session.update({
    where: { id },
    data: { updatedAt: new Date() },
  });
  return {
    id: session.id,
    userId: session.userId,
    title: session.title,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export async function deleteSession(id: number): Promise<void> {
  await prisma.session.delete({
    where: { id },
  });
}

export async function findMessagesBySessionId(
  sessionId: number,
  cursor?: Date,
  limit?: number,
): Promise<{ messages: Message[]; hasMore: boolean }> {
  const messages = await prisma.message.findMany({
    where: {
      sessionId,
      ...(cursor ? { createdAt: { lt: cursor } } : {}),
    },
    orderBy: { createdAt: "asc" },
    take: (limit || 20) + 1,
  });

  const hasMore = messages.length > (limit || 20);
  const resultMessages = hasMore ? messages.slice(0, -1) : messages;

  return {
    messages: resultMessages.map((m) => ({
      id: m.id,
      sessionId: m.sessionId,
      role: m.role as "user" | "assistant",
      content: m.content,
      createdAt: m.createdAt,
    })),
    hasMore,
  };
}

export async function createMessage(
  sessionId: number,
  role: "user" | "assistant",
  content: string,
): Promise<Message> {
  const message = await prisma.message.create({
    data: { sessionId, role, content },
  });
  return {
    id: message.id,
    sessionId: message.sessionId,
    role: message.role as "user" | "assistant",
    content: message.content,
    createdAt: message.createdAt,
  };
}

export async function updateMessageContent(
  id: number,
  content: string,
): Promise<Message> {
  const message = await prisma.message.update({
    where: { id },
    data: { content },
  });
  return {
    id: message.id,
    sessionId: message.sessionId,
    role: message.role as "user" | "assistant",
    content: message.content,
    createdAt: message.createdAt,
  };
}

export async function findMessagesCountBySessionId(
  sessionId: number,
): Promise<number> {
  return prisma.message.count({
    where: { sessionId },
  });
}
