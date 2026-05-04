<script setup lang="ts">
interface Props {
  visible: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  scrollToBottom: []
}>()

const handleClick = () => {
  emit('scrollToBottom')
}
</script>

<template>
  <transition name="fade">
    <button v-if="visible" class="scroll-to-bottom" @click="handleClick">
      ↓
    </button>
  </transition>
</template>

<style scoped>
.scroll-to-bottom {
  position: absolute;
  bottom: 80px;
  right: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
}

.scroll-to-bottom:hover {
  background: #f5f5f5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>