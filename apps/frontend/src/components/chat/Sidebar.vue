<script setup lang="ts">
import { ref } from 'vue';
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

const isCollapse = ref(false)
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
defineExpose({ toggleCollapse })
</script>

<template>
  <div class="sidebar" :class="{ collapse: isCollapse }">
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
  transition: all 0.2s ease;
}

.sidebar.collapse {
  width: 0;
  overflow: hidden;
}

@media (max-width:768px) {
  .sidebar {
    width: 260px;
    height: 100%;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e8e8e8;
    width: 0;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .sidebar.collapse {
    width: 260px;
  }
}
</style>