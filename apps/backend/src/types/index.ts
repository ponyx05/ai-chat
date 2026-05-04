export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
}

export interface SessionData {
  id: number;
  title: string;
  updatedAt: Date;
}

export interface MessageData {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface GetMessagesQuery {
  cursor?: string;
  limit?: number;
}

export interface MessagesPagination {
  hasMore: boolean;
  nextCursor: string | null;
}

export interface MessagesResponse {
  data: MessageData[];
  pagination: MessagesPagination;
}

export interface SendMessageBody {
  sessionId?: number;
  content: string;
}

export interface SendMessageResponse {
  sessionId: number;
  assistantMessageId?: number;
}

export interface UpdateSessionTitleBody {
  title: string;
}

export interface UserData {
  userId: number;
  username: string;
  createdAt: Date;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface RegisterResponse {
  userId: number;
  username: string;
}

export interface RegisterBody {
  username: string;
  password: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface ChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}

export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
