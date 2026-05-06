<script setup lang="ts">
const modelValue = defineModel()

const emit = defineEmits<{
  scrollToBottom: []
}>()
</script>

<template>
  <transition name="fade">
    <button v-if="modelValue" class="scroll-to-bottom" @click=" emit('scrollToBottom')">
      ↓
    </button>
  </transition>
</template>

<style scoped>
.scroll-to-bottom {
  position: fixed;
  bottom: 18%;
  right: 44%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e8e8e8;
  font-size: 1.3em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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