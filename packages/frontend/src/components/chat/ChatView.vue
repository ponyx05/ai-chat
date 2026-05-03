<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import Sidebar from './Sidebar.vue'
import WelcomeView from './WelcomeView.vue'
import MessageBubble from './MessageBubble.vue'
import AssistantMessage from './AssistantMessage.vue'
import MessageInput from './MessageInput.vue'
import ScrollToBottom from './ScrollToBottom.vue'
import { useChatStore } from '../../store/chat'


const chatStore = useChatStore()

const messageListRef = ref<HTMLElement | null>(null)
const showScrollButton = ref(false)
const isAtBottom = ref(true)
const isSending = ref(false)
const hasStartedChat = ref(false)

const handleScroll = () => {
  if (!messageListRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = messageListRef.value
  isAtBottom.value = scrollHeight - scrollTop - clientHeight < 50
  showScrollButton.value = !isAtBottom.value
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTo({
      top: messageListRef.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

const handleNewChat = () => {
  hasStartedChat.value = false
  chatStore.createNewSession()
}

const handleSendMessage = async (content: string) => {

  if (isSending.value) return
  isSending.value = true
  try {
    hasStartedChat.value = true
    await chatStore.sendMessage(content)
    setTimeout(scrollToBottom, 100)
  } finally {
    isSending.value = false
  }
}

watch(() => chatStore.messages.length, () => {
  nextTick(() => {
    if (isAtBottom.value) {
      scrollToBottom()
    } else {
      showScrollButton.value = true
    }
  })
})

onMounted(async () => {
  await chatStore.fetchSessions()
  if (messageListRef.value) {
    messageListRef.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (messageListRef.value) {
    messageListRef.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="chat-view">
    <Sidebar @new-chat="handleNewChat" @select-session="() => hasStartedChat = true" />
    <div class="main-content">
      <WelcomeView v-if="!hasStartedChat" @send="handleSendMessage" />
      <template v-else>
        <div ref="messageListRef" class="message-list">
          <a-spin v-if="chatStore.isAIThinking" class="loading-spinner" />
          <template v-else>
            <template v-for="msg in chatStore.messages" :key="msg.id">
              <MessageBubble v-if="msg.role === 'user'" :content="msg.content" />
              <AssistantMessage v-else :content="msg.content" />
            </template>
          </template>
        </div>
        <div class="message-container">
          <MessageInput placeholder="有问题，尽管问" @send="handleSendMessage" />
        </div>
      </template>
    </div>
    <ScrollToBottom :visible="showScrollButton" @scroll-to-bottom="scrollToBottom" />
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
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.message-container {
  border-top: 1px solid #e8e8e8;
  padding: 16px 24px;
}
</style>