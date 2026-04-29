<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { Typography, Space, Button } from 'ant-design-vue'
import { useAuthStore } from '../store/auth'

const router: Router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.userInfo) {
    await authStore.fetchCurrentUser()
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleChangePassword = () => {
  router.push('/change-password')
}
</script>

<template>
  <div class="home-container">
    <a-card class="home-card">
      <Typography.Title :level="2">首页</Typography.Title>
      <a-card class="user-info-card">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="用户ID">
            {{ authStore.userInfo?.userId }}
          </a-descriptions-item>
          <a-descriptions-item label="用户名">
            {{ authStore.userInfo?.username }}
          </a-descriptions-item>
          <a-descriptions-item label="注册时间">
            {{ authStore.userInfo?.createdAt }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <Space class="action-space">
        <Button type="primary" @click="handleChangePassword">修改密码</Button>
        <Button danger @click="handleLogout">退出登录</Button>
      </Space>
    </a-card>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.home-card {
  width: 500px;
}

.user-info-card {
  margin: 24px 0;
}

.action-space {
  display: flex;
  gap: 12px;
}
</style>
