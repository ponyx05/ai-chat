<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello from Vue!')
</script>

<template>
  <el-container class="container">
    <el-header>
      <h1>AI Chat</h1>
    </el-header>
    <el-main>
      <el-card class="card">
        <template #header>
          <div class="card-header">
            <span>Welcome</span>
          </div>
        </template>
        <div class="card-content">
          <el-tag type="success">{{ message }}</el-tag>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.el-header {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}
.el-header h1 {
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
