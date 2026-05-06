export interface SessionData {
  id: number;
  title: string;
  updatedAt: Date;
}

export interface MessageData {
  id: number;
  role: "user" | "assistant";
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
  // pagination: MessagesPagination;
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
