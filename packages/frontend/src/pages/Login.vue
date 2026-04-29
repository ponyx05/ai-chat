<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '../store/auth'

const router: Router = useRouter()
const authStore = useAuthStore()

const formState = ref({
  username: '',
  password: ''
})

const loading = ref(false)

const handleSubmit = async () => {
  if (!formState.value.username || !formState.value.password) {
    message.warning('请填写用户名和密码')
    return
  }

  loading.value = true
  try {
    await authStore.login(formState.value.username, formState.value.password)
    message.success('登录成功')
    router.push('/home')
  } catch (err: any) {
    message.error(err.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <a-card class="auth-card">
      <h2 class="auth-title">登录</h2>
      <a-form :model="formState" @finish="handleSubmit">
        <a-form-item name="username">
          <a-input v-model:value="formState.username" placeholder="用户名" size="large" />
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="formState.password" placeholder="密码" size="large" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" :loading="loading" block>
            登录
          </a-button>
        </a-form-item>
      </a-form>
      <div class="auth-footer">
        还没有账号？<a href="/register">立即注册</a>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.auth-card {
  width: 400px;
}

.auth-title {
  text-align: center;
  margin-bottom: 24px;
}

.auth-footer {
  text-align: center;
  margin-top: 16px;
}
</style>
