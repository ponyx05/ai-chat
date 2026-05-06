import request, { type ApiResponse } from "./request";
import type { Session, SendMessageReq, MessagesResponse } from "../types/chat";
import { getToken } from "../utils";

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
  onDone: () => void;
  onError: (error: Error) => void;
}

export const sendMessageSSE = (
  data: SendMessageReq,
  options: SendMessageSSEOptions,
) => {
  const token = getToken();
  const url = `${request.defaults.baseURL}/chat/messages`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("建立流管道", { response });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder("utf-8"); //流式接口偏底层，需要自行处理网络传输的二进制分片

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            options.onDone();
            break;
          }

          let buffer = "";
          buffer += decoder.decode(value, { stream: true });
          // console.log({ buffer });

          buffer = buffer.replaceAll("\n\n", "");

          const lines = buffer.split("\n");
          // console.log({ lines });

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

          if (!data) continue;

          try {
            const eventData = JSON.parse(data);
            if (eventType === "session") {
              options.onSession(eventData.sessionId);
            }
            if (eventType === "message") {
              options.onChunk(eventData.content);
            }
          } catch {
            // ignore parse error
          }
        }
      } catch (error) {
        options.onError(error as Error);
      }
    })
    .catch(options.onError);
};
