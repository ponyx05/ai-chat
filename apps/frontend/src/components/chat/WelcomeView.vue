<script setup lang="ts">
import MessageInput from './MessageInput.vue'
import { useAuthStore } from '../../store'

const authStore = useAuthStore()

const emit = defineEmits<{
  send: [content: string]
}>()

const handleSend = (content: string) => {
  emit('send', content)
}
</script>

<template>
  <div class="welcome-view">
    <div class="welcome-content">
      <h1 class="welcome-title">你好，{{ authStore.userInfo?.username || '用户' }}</h1>
      <div class="welcome-input-wrapper">
        <MessageInput placeholder="有问题，尽管问" @send="handleSend" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-view {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.welcome-content {
  text-align: center;
  max-width: 600px;
  padding: 0 24px;
  width: 100%;
}

.welcome-title {
  font-size: 32px;
  color: #333;
  margin-bottom: 24px;
  font-weight: 600;
}

.welcome-input-wrapper {
  max-width: 560px;
  margin: 0 auto;
}
</style>