<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello from Vue!')
</script>

<template>
  <a-layout class="container">
    <a-layout-header>
      <h1>AI Chat</h1>
    </a-layout-header>
    <a-layout-content>
      <a-card class="card" :headStyle="{ fontWeight: 'bold' }">
        <template #title>
          <div class="card-header">Welcome</div>
        </template>
        <div class="card-content">
          <a-tag color="success">{{ message }}</a-tag>
        </div>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.ant-layout-header {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
.ant-layout-header h1 {
  color: white;
  margin: 0;
  font-size: 24px;
}
.card {
  max-width: 500px;
  margin: 40px auto;
}
.card-header {
  font-weight: bold;
}
.card-content {
  padding: 20px 0;
  text-align: center;
}
</style>