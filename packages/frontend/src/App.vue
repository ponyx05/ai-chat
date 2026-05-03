<script setup lang="ts">
import { onMounted } from 'vue'
import ErrorProvider from './components/ErrorProvider.vue'
import { useAuthStore } from './store/auth'

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.token && !authStore.userInfo) {
    authStore.fetchCurrentUser()
  }
})
</script>

<template>
  <ErrorProvider>
    <router-view />
  </ErrorProvider>
</template>

<style>
#app {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
