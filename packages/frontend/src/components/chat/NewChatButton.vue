<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'

const emit = defineEmits<{
  newChat: []
}>()

const handleClick = () => {
  emit('newChat')
}
</script>

<template>
  <div class="new-chat-button" @click="handleClick">
    <PlusOutlined />
    <span>新建会话</span>
  </div>
</template>

<style scoped>
.new-chat-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
}

.new-chat-button:hover {
  background-color: #f0f0f0;
  border-color: #1890ff;
  color: #1890ff;
}
</style>