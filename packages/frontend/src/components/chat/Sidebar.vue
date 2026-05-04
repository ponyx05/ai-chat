<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NewChatButton from './NewChatButton.vue'
import SessionList from './SessionList.vue'
import UserFooter from './UserFooter.vue'
import { useAuthStore } from '../../store/auth'
import type { Session } from '../../apis/session'

interface Props {
  username?: string
}

defineProps<Props>()

const router = useRouter()
const authStore = useAuthStore()

const emit = defineEmits<{
  newChat: []
  selectSession: [id: number]
}>()

const handleNewChat = () => {
  emit('newChat')
}

const handleSessionSelect = (session: Session) => {
  emit('selectSession', session.id)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <NewChatButton @new-chat="handleNewChat" />
    </div>
    <SessionList @session-select="handleSessionSelect" @new-chat="handleNewChat" />
    <UserFooter @logout="handleLogout" />
  </div>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100%;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8e8e8;
}
</style>