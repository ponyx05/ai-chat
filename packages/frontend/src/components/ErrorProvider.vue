<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { notification } from 'ant-design-vue'
import emitter from '../utils/eventBus'

onMounted(() => {
  emitter.on('apiError', (message: string) => {
    notification.error({
      message: '温馨提示',
      description: message,
      placement: 'topRight',
      duration: 3
    })
  })
})

onUnmounted(() => {
  emitter.off('apiError')
})
</script>

<template>
  <slot />
</template>