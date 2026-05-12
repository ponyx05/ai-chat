<script setup lang="ts">
interface Props {
  content: string
  timestamp?: string
}

defineProps<Props>()
</script>

<template>
  <div class="message-bubble">
    <div class="bubble-content">{{ content }}</div>
    <div v-if="timestamp" class="bubble-time">{{ timestamp }}</div>
  </div>
</template>

<style scoped>
.message-bubble {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 1em 0;
}

.bubble-content {
  max-width: 70%;
  padding: 12px 16px;
  background: #e8f4ff;
  border-radius: 16px;
  border-bottom-right-radius: 4px;
  line-height: 1.5;
  word-break: break-word;
}

.bubble-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>