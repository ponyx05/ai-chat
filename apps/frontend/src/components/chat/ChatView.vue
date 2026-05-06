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
const shouldScroll = ref(false)//AI回复时是否自动滚动到底部

const handleScroll = () => {
  if (!messageListRef.value) return
  shouldScroll.value = false
  const { scrollTop, scrollHeight, clientHeight } = messageListRef.value
  isAtBottom.value = scrollHeight - scrollTop - clientHeight < 100
  showScrollButton.value = !isAtBottom.value
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value && messageListRef.value.scrollHeight) {
    messageListRef.value.scrollTo({
      top: messageListRef.value.scrollHeight,
      behavior: 'smooth'
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

onUpdated(() => {

})

// 页面先展示欢迎页，因此onMounted拿不到实例ref
watch(messageListRef, (newEle, _oldEle) => {
  // Vue底层调用effect此时ref实例还没渲染，因此oldEle为undefined，选择session后。newEle得到实例ref。

  if (newEle) {
    console.log({ scrollTop: messageListRef.value!.scrollTop, scrollHeight: messageListRef.value!.scrollHeight });

    messageListRef.value!.scrollTop = messageListRef.value?.scrollHeight as number
    messageListRef.value?.addEventListener('scroll', handleScroll)
  }
  if (!newEle) {
    messageListRef.value?.removeEventListener('scroll', handleScroll)
  }
}, {
  deep: true
})

// AI回复的自动滚动到底部
watch(() => chatStore.currentSession?.messages, async () => {
  if (!chatStore.isAIThinking) {
    shouldScroll.value = false
  }
  if (shouldScroll.value) {
    console.log({ message: chatStore.currentSession?.messages });
    scrollToBottom()
  }
}, {
  deep: true
})

onMounted(async () => {
  await chatStore.fetchSessions()
})
onUnmounted(() => {
  messageListRef.value?.removeEventListener('scroll', handleScroll)
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
              <AssistantMessage v-else :content="msg.content" :is-loading="isAiMessageLoading(index, msg.role)" />
            </template>
          </div>
          <ScrollToBottom v-model="showScrollButton" @scroll-to-bottom="scrollToBottom" />
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