<script setup lang="ts">
import ErrorProvider from './components/ErrorProvider.vue'
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
