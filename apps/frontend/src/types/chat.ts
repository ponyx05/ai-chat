export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface Session {
  id: number
  title: string
  updatedAt: string
  messages: Message[]
}

export interface SendMessageReq {
  sessionId?: number
  content: string
}

export interface SendMessageResp {
  session: Session
  message: Message
}

export interface MessagesResponse {
  data: Message[]
  pagination: {
    hasMore: boolean
    nextCursor: string | null
  }
}