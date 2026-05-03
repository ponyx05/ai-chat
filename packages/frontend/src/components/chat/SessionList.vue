<script setup lang="ts">
import { computed } from 'vue'
import { message } from 'ant-design-vue'
import SessionItem from './SessionItem.vue'
import { useChatStore } from '../../store/chat'
import type { Session } from '../../types/chat'

const chatStore = useChatStore()

const sessions = computed(() => chatStore.sessions)
const loading = computed(() => chatStore.isLoading)
const currentSessionId = computed(() => chatStore.currentSessionId)

const emit = defineEmits<{
  sessionSelect: [session: Session]
  newChat: []
}>()

const loadSessions = async () => {
  await chatStore.fetchSessions()
}

const handleSelect = async (session: Session) => {
  await chatStore.selectSession(session.id)
  emit('sessionSelect', session)
}

const handleDelete = async (id: number) => {
  try {
    await chatStore.deleteSession(id)
    if (currentSessionId.value === id) {
      chatStore.createNewSession()
    }
    message.success('删除成功')
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

const handleUpdate = async (id: number, newTitle: string) => {
  await chatStore.updateSessionTitle(id, newTitle)
  message.success('更新成功')
}

defineExpose({
  loadSessions
})
</script>

<template>
  <div class="session-list">
    <div v-if="loading" class="loading">
      <a-spin size="small" />
    </div>
    <div v-else-if="sessions.length === 0" class="empty">
      暂无会话
    </div>
    <template v-else>
      <SessionItem v-for="session in sessions" :key="session.id" :session="session"
        :is-active="session.id === currentSessionId" @select="handleSelect" @delete="handleDelete"
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

.loading,
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: #999;
  font-size: 14px;
}
</style>