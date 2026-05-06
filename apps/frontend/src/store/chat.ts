import { defineStore } from "pinia";
import { ref, computed } from "vue";
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
  const aiReplyingSessionId = ref<number | null>(null);
  const hasStartedChat = ref<boolean>(false); //控制是否展示欢迎页面
  const isLoading = ref(false);
  const isAIThinking = ref(false);

  const currentSession = computed(() =>
    sessions.value.find((s) => s.id === currentSessionId.value),
  );

  const fetchSessions = async () => {
    isLoading.value = true;
    try {
      const res = await getSessions();
      sessions.value = res.data.data.map((session: Session) => {
        const messages = sessions.value.find(
          (item) => item.id === session.id,
        )?.messages;
        return {
          ...session,
          messages: messages || [],
        };
      });
      console.log({ sessions: sessions.value });
    } finally {
      isLoading.value = false;
    }
  };

  const selectSession = async (sessionId: number) => {
    currentSessionId.value = sessionId;
    if (currentSession.value && currentSession.value.messages.length === 0) {
      await fetchMessages(sessionId);
    }
  };

  const createNewSession = () => {
    currentSessionId.value = null;
  };

  const deleteSession = async (sessionId: number) => {
    await deleteSessionApi(sessionId);
    sessions.value = sessions.value.filter(
      (sessioin) => sessioin.id !== sessionId,
    );
    if (currentSessionId.value === sessionId) {
      currentSessionId.value = null;
    }
  };

  const updateSessionTitle = async (sessionId: number, title: string) => {
    const res = await updateSessionTitleApi(sessionId, title);
    const updatedSession = res.data.data;
    const session = sessions.value.find(
      (sessioin) => sessioin.id === sessionId,
    );
    if (session) {
      session.title = updatedSession.title;
      session.updatedAt = updatedSession.updatedAt;
    }
  };

  const fetchMessages = async (sessionId: number) => {
    isLoading.value = true;
    try {
      const res = await getMessagesApi(sessionId);
      const session = sessions.value.find(
        (sessioin) => sessioin.id === sessionId,
      );
      if (session) {
        session.messages = res.data.data.data;
      }
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
    currentSession.value?.messages.push(userMessage);

    aiReplyingSessionId.value = currentSessionId.value;
    isAIThinking.value = true;
    // 回复加载状态依赖messages中最后一项且为ai回复的数据，因此添加占位数据，维持加载状态
    const dummyAIMessage: Message = {
      id: -1,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };
    currentSession.value?.messages.push(dummyAIMessage);

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
              currentSession.value?.messages.splice(
                currentSession.value.messages.findIndex(
                  (item) => item.id === -1,
                ),
                1,
              );
            }

            fullContent += chunk;

            const lastMsg =
              currentSession.value?.messages[
                currentSession.value.messages.length - 1
              ];
            if (lastMsg?.role === "assistant") {
              // 拿到引用，前端分片拼接关键
              lastMsg.content = fullContent;
            } else {
              // dummyAIMessage清除后进入此分支，添加AI回复Message后上面才能拿引用
              currentSession.value?.messages.push({
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
            aiReplyingSessionId.value = null;
            const currentIdx = sessions.value.findIndex(
              (session) => session.id === sessionId,
            );
            if (currentIdx > 0) await fetchSessions(); //更新会话列表排序
            console.log({ currentSession: currentSession.value });
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
    currentSession,
    aiReplyingSessionId,
    hasStartedChat,
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
