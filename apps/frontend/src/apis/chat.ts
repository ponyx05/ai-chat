import request, { type ApiResponse } from "./request";
import type { Session, SendMessageReq, MessagesResponse } from "../types/chat";

export interface SessionListResp {
  id: number;
  title: string;
  updatedAt: string;
}

export const getSessions = () => {
  return request.get<any, { data: ApiResponse<Session[]> }>("/chat/sessions");
};

export const deleteSession = (id: number) => {
  return request.delete<any, { data: ApiResponse<null> }>(
    `/chat/sessions/${id}`,
  );
};

export const updateSessionTitle = (id: number, title: string) => {
  return request.put<any, { data: ApiResponse<Session> }>(
    `/chat/sessions/${id}`,
    { title },
  );
};

export const getMessages = (sessionId: number) => {
  return request.get<any, { data: ApiResponse<MessagesResponse> }>(
    `/chat/sessions/${sessionId}/messages`,
  );
};

export interface SendMessageSSEOptions {
  onChunk: (content: string) => void;
  onSession: (sessionId: number) => void;
  onDone: (messageId: number) => void;
  onError: (error: Error) => void;
}

export const sendMessageSSE = (
  data: SendMessageReq,
  options: SendMessageSSEOptions,
) => {
  const token = localStorage.getItem("token");
  const url = `${request.defaults.baseURL}/chat/messages`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split("\n\n");
          buffer = events.pop() || "";

          for (const event of events) {
            const lines = event.split("\n");
            let eventType = "";
            let data = "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine) continue;

              if (trimmedLine.startsWith("event:")) {
                eventType = trimmedLine.slice(6).trim();
              } else if (trimmedLine.startsWith("data:")) {
                data = trimmedLine.slice(6).trim();
              }
            }

            if (!data || data === "[DONE]") continue;

            try {
              const eventData = JSON.parse(data);
              if (eventType === "session") {
                options.onSession(eventData.sessionId);
              } else if (eventType === "message") {
                options.onChunk(eventData.content);
              } else if (eventType === "done") {
                options.onDone(eventData.id);
              }
            } catch {
              // ignore parse error
            }
          }
        }

        if (buffer.trim()) {
          const remainingEvents = buffer.split("\n\n");

          for (const eventText of remainingEvents) {
            const lines = eventText.split("\n");
            let eventType = "";
            let data = "";

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine) continue;

              if (trimmedLine.startsWith("event:")) {
                eventType = trimmedLine.slice(5).trim();
              } else if (trimmedLine.startsWith("data:")) {
                data = trimmedLine.slice(5).trim();
              }
            }

            if (!data || data === "[DONE]") continue;

            try {
              const eventData = JSON.parse(data);
              if (eventType === "session") {
                options.onSession(eventData.sessionId);
              } else if (eventType === "message") {
                options.onChunk(eventData.content);
              } else if (eventType === "done") {
                options.onDone(eventData.id);
              }
            } catch {
              // ignore parse error
            }
          }
        }
      } catch (error) {
        options.onError(error as Error);
      }
    })
    .catch(options.onError);
};
