<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { nextTick, ref, watch } from 'vue'
import { useChatStore } from '../../store/chat';

interface Props {
  placeholder?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  placeholder: '有问题，尽管问',
  disabled: false
})

const emit = defineEmits<{
  send: [content: string]
}>()

const inputValue = ref('')
const { currentSessionId } = storeToRefs(useChatStore())

const handleSend = () => {
  const content = inputValue.value.trim()
  if (!content) return
  emit('send', content)
  inputValue.value = ''
}

const textareaRef = ref<HTMLTextAreaElement>()
watch(() => currentSessionId.value, async () => {
  await nextTick()
  textareaRef.value?.focus()
}, { immediate: true })
</script>

<template>
  <div class="message-input-wrapper">
    <div class="message-input-container">
      <textarea ref="textareaRef" v-model="inputValue" class="message-input" :placeholder="placeholder"
        :disabled="disabled" @keyup.enter.prevent="handleSend" />
      <button class="send-btn" type="button" :disabled="disabled || !inputValue.trim()" @click="handleSend">
        →
      </button>
    </div>
  </div>
</template>

<style scoped>
.message-input-wrapper {
  padding: 16px 24px;
}

.message-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 24px;
  padding: 8px 16px;
}

.message-input {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  field-sizing: content;
  max-height: 230px;
  background: transparent;
}

.message-input::placeholder {
  color: #999;
}

.send-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #1890ff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  transition: background 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.send-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}
</style>