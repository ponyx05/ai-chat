<script setup lang="ts">
import { ref, computed } from 'vue'
import { DeleteOutlined, MoreOutlined, EditOutlined } from '@ant-design/icons-vue'

interface Session {
  id: number
  title: string
  updatedAt: string
}

const props = defineProps<{
  session: Session
  isActive: boolean
}>()

const emit = defineEmits<{
  select: [session: Session]
  delete: [id: number]
  rename: [id: number, title: string]
}>()

const isEditing = ref(false)
const editTitle = ref('')

const startEdit = () => {
  editTitle.value = props.session.title
  isEditing.value = true
}

const confirmEdit = () => {
  if (editTitle.value.trim() && editTitle.value !== props.session.title) {
    emit('rename', props.session.id, editTitle.value.trim())
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
}

const handleMenuClick = (key: string) => {
  if (key === 'edit') {
    startEdit()
  } else if (key === 'delete') {
    emit('delete', props.session.id)
  }
}

const handleClick = () => {
  emit('select', props.session)
}
</script>

<template>
  <div class="session-item" :class="{ active: isActive }" @click="isEditing ? null : handleClick()">
    <a-input v-if="isEditing" v-model:value="editTitle" class="edit-input" @press-enter="confirmEdit" @blur="cancelEdit"
      @click.stop />
    <span v-else class="title">{{ props.session.title }}</span>
    <a-dropdown trigger="click" @click.stop>
      <MoreOutlined class="more-icon" />
      <template #overlay>
        <a-menu @click="({ key }: { key: string }) => handleMenuClick(key)">
          <a-menu-item key="edit">
            <EditOutlined /> 编辑
          </a-menu-item>
          <a-menu-item key="delete" danger>
            <DeleteOutlined /> 删除
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<style scoped>
.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.session-item:hover {
  background-color: #f0f0f0;
}

.session-item.active {
  background-color: #e6f4ff;
}

.title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.more-icon {
  padding: 4px;
  color: #999;
}

.edit-input {
  flex: 1;
  margin-right: 8px;
}
</style>