<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import Sidebar from './Sidebar.vue'
import WelcomeView from './WelcomeView.vue'
import MessageBubble from './MessageBubble.vue'
import AssistantMessage from './AssistantMessage.vue'
import MessageInput from './MessageInput.vue'
import ScrollToBottom from './ScrollToBottom.vue'
import { useChatStore } from '../../store/chat'

const chatStore = useChatStore()
const { hasStartedChat, currentSessionId } = storeToRefs(useChatStore())

const messageListRef = ref<HTMLElement>()
const showScrollButton = ref(false)
const isAtBottom = ref(true)
const shouldScroll = ref(false)
const isInitialLoad = ref(true)//由于hasStartedChat默认为false页面首次渲染不渲染messageList，onMounted拿不到ref实例，所以需要该状态控制首次滚动。

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value && messageListRef.value.scrollHeight) {
    messageListRef.value.scrollTo({
      top: messageListRef.value.scrollHeight,
      behavior: 'instant'
    })
  }
}

const handleNewChat = () => {
  hasStartedChat.value = false
  currentSessionId.value = null
}

const handleSendMessage = async (content: string) => {
  if (!hasStartedChat.value) {
    await chatStore.createNewSession(content)
  }
  try {
    hasStartedChat.value = true
    shouldScroll.value = true
    await chatStore.sendMessage(content)
  } catch (err) {
    console.error(err);
  }
}

const handleSelectSession = () => {
  hasStartedChat.value = true
}

const isAiMessageLoading = (index: number, role: string) => {
  return chatStore.aiReplyingSessionId === chatStore.currentSessionId && index === (chatStore.currentSession?.messages.length ?? 0) - 1 && role === 'assistant' && chatStore.isAIThinking
}

const handleScroll = () => {
  if (!messageListRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = messageListRef.value
  isAtBottom.value = scrollHeight - scrollTop - clientHeight < 100
  showScrollButton.value = !isAtBottom.value
}

watch(() => currentSessionId.value, () => {
  isInitialLoad.value = true
})

const handleWheel = () => {
  shouldScroll.value = false
}

const handleScrollButton = () => {
  shouldScroll.value = true
  scrollToBottom()
}

onUpdated(() => {
  messageListRef.value?.removeEventListener('wheel', handleWheel)
  messageListRef.value?.removeEventListener('scroll', handleScroll)
  messageListRef.value?.addEventListener('wheel', handleWheel)
  messageListRef.value?.addEventListener('scroll', handleScroll)
  if (isInitialLoad.value && messageListRef.value) {
    messageListRef.value.scrollTo({
      top: messageListRef.value.scrollHeight,
    })
    isInitialLoad.value = false
  }
  if (shouldScroll.value && messageListRef.value) {
    scrollToBottom()
  }
})


onMounted(async () => {
  await chatStore.fetchSessions()
})
onUnmounted(() => {
  messageListRef.value?.removeEventListener('scroll', handleScroll)
  messageListRef.value?.removeEventListener('wheel', handleWheel)
})
</script>

<template>
  <div class="chat-view">
    <Sidebar @new-chat="handleNewChat" @select-session="handleSelectSession" />
    <div class="main-content">
      <WelcomeView v-if="!hasStartedChat" @send="handleSendMessage" />
      <template v-else>
        <div v-if="chatStore.isLoading" class="loading-container">
          <a-spin size="large" />
        </div>
        <template v-else>
          <div ref="messageListRef" class="message-list">
            <template v-for="(msg, index) in chatStore.currentSession?.messages" :key="msg.id">
              <MessageBubble v-if="msg.role === 'user'" :content="msg.content" />
              <AssistantMessage v-else :content="msg.content" :messageId="msg.id"
                :is-loading="isAiMessageLoading(index, msg.role)" />
            </template>
          </div>
          <ScrollToBottom v-model="showScrollButton" @scroll-to-bottom="handleScrollButton" />
          <div class="message-container">
            <MessageInput placeholder="有问题，尽管问" :disabled="chatStore.isAIThinking" @send="handleSendMessage" />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.chat-view {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px 24px 100px 24px;
}

.message-container {
  border-top: 1px solid #e8e8e8;
  padding: 16px 24px;
}

.loading-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>