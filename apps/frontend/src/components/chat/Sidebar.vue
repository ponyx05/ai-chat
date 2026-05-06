<script setup lang="ts">
import NewChatButton from './NewChatButton.vue'
import SessionList from './SessionList.vue'
import UserFooter from './UserFooter.vue'

interface Props {
  username?: string
}

defineProps<Props>()
const emit = defineEmits<{
  newChat: []
  selectSession: []
}>()

</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <NewChatButton @new-chat="emit('newChat')" />
    </div>
    <SessionList @session-select="emit('selectSession')" />
    <UserFooter />
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