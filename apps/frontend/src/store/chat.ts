import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getSessions,
  deleteSession as deleteSessionApi,
  updateSessionTitle as updateSessionTitleApi,
  getMessages as getMessagesApi,
  sendMessageSSE,
} from "../apis/chat";
import type { Message, Session } from "../types/chat";

export const useChatStore = defineStore("chat", () => {
  const sessions = ref<Session[]>([]);
  const currentSessionId = ref<number | null>(null);
  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const isAIThinking = ref(false);

  const fetchSessions = async () => {
    isLoading.value = true;
    try {
      const res = await getSessions();
      sessions.value = res.data.data;
    } finally {
      isLoading.value = false;
    }
  };

  const selectSession = async (sessionId: number) => {
    currentSessionId.value = sessionId;
    await fetchMessages(sessionId);
  };

  const createNewSession = async () => {
    currentSessionId.value = null;
    messages.value = [];
  };

  const deleteSession = async (sessionId: number) => {
    await deleteSessionApi(sessionId);
    sessions.value = sessions.value.filter((s) => s.id !== sessionId);
    if (currentSessionId.value === sessionId) {
      currentSessionId.value = null;
      messages.value = [];
    }
  };

  const updateSessionTitle = async (sessionId: number, title: string) => {
    const res = await updateSessionTitleApi(sessionId, title);
    const updatedSession = res.data.data;
    const index = sessions.value.findIndex((s) => s.id === sessionId);
    if (index !== -1) {
      sessions.value[index] = updatedSession;
    }
  };

  const fetchMessages = async (sessionId: number) => {
    isLoading.value = true;
    try {
      const res = await getMessagesApi(sessionId);
      messages.value = res.data.data.data;
    } finally {
      isLoading.value = false;
    }
  };

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    messages.value.push(userMessage);

    isAIThinking.value = true;
    // 回复加载状态依赖messages中最后一项且为ai回复的数据，因此添加占位数据，维持加载状态
    const dummyAIMessage: Message = {
      id: -1,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };
    messages.value.push(dummyAIMessage);

    let sessionId = currentSessionId.value;
    let fullContent = "";

    await new Promise<void>((resolve, reject) => {
      sendMessageSSE(
        { sessionId: sessionId || undefined, content },
        {
          onChunk: (chunk) => {
            // console.log({ chunk });
            if (chunk.includes("</think>")) {
              isAIThinking.value = false;
              // 清除临时占位
              messages.value.splice(
                messages.value.findIndex((item) => item.id === -1),
                1,
              );
            }

            fullContent += chunk;

            const lastMsg = messages.value[messages.value.length - 1];
            if (lastMsg?.role === "assistant") {
              // 拿到引用，前端分片拼接关键
              lastMsg.content = fullContent;
            } else {
              // dummyAIMessage清除后进入此分支，添加AI回复Message后上面才能拿引用
              messages.value.push({
                id: Date.now(),
                role: "assistant",
                content: fullContent,
                createdAt: new Date().toISOString(),
              });
            }
          },
          onSession: async (newSessionId) => {
            sessionId = newSessionId;
            await fetchSessions();
            resolve();
          },
          onDone: async () => {
            isAIThinking.value = false;
            const currentIdx = sessions.value.findIndex(
              (session) => session.id === sessionId,
            );
            if (currentIdx > 0) await fetchSessions(); //更新排序
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        },
      );
    });

    if (!sessionId) {
      throw new Error("Session not created");
    }

    currentSessionId.value = sessionId;
  };

  return {
    sessions,
    currentSessionId,
    messages,
    isLoading,
    isAIThinking,
    fetchSessions,
    selectSession,
    createNewSession,
    deleteSession,
    updateSessionTitle,
    fetchMessages,
    sendMessage,
  };
});
