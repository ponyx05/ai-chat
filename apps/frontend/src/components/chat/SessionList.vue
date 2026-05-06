<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import SessionItem from './SessionItem.vue'
import { useChatStore } from '../../store/chat'
import type { Session } from '../../types/chat'

const chatStore = useChatStore()


const emit = defineEmits<{
  sessionSelect: []
}>()


const handleSelect = async (session: Session) => {
  await chatStore.selectSession(session.id)
  emit('sessionSelect')
}

const handleDelete = async (id: number) => {
  try {
    await chatStore.deleteSession(id)
    message.success('删除成功')
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

const handleUpdate = async (id: number, newTitle: string) => {
  await chatStore.updateSessionTitle(id, newTitle)
  message.success('更新成功')
}
watch(() => chatStore.sessions, () => {
  if (!chatStore.sessions.length) return
  chatStore.hasStartedChat = true
  chatStore.currentSessionId = chatStore.sessions[0].id
  chatStore.selectSession(chatStore.sessions[0].id)
})

</script>

<template>
  <div class="session-list">
    <div v-if="chatStore.sessions.length === 0" class="empty">
      暂无会话
    </div>
    <template v-else>
      <SessionItem v-for="session in chatStore.sessions" :key="session.id" :session="session"
        :is-active="session.id === chatStore.currentSessionId" @select="handleSelect" @delete="handleDelete"
        @rename="handleUpdate" />
    </template>
  </div>
</template>

<style scoped>
.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #999;
  font-size: 14px;
}
</style>