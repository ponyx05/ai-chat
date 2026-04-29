<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '../store/auth'

const router: Router = useRouter()
const authStore = useAuthStore()

const formState = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)

const handleSubmit = async () => {
  if (!formState.value.username || !formState.value.password) {
    message.warning('请填写用户名和密码')
    return
  }
  if (formState.value.password.length < 6) {
    message.warning('密码至少6位')
    return
  }
  if (formState.value.password !== formState.value.confirmPassword) {
    message.warning('两次密码不一致')
    return
  }

  loading.value = true
  try {
    await authStore.register(formState.value.username, formState.value.password)
    message.success('注册成功，请登录')
    router.push('/login')
  } catch (err: any) {
    message.error(err.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <a-card class="auth-card">
      <h2 class="auth-title">注册</h2>
      <a-form :model="formState" @finish="handleSubmit">
        <a-form-item name="username">
          <a-input v-model:value="formState.username" placeholder="用户名（3-50字符）" size="large" />
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="formState.password" placeholder="密码（6-20字符）" size="large" />
        </a-form-item>
        <a-form-item name="confirmPassword">
          <a-input-password v-model:value="formState.confirmPassword" placeholder="确认密码" size="large" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" block size="large">
            注册
          </a-button>
        </a-form-item>
      </a-form>
      <div class="auth-footer">
        已有账号？<a href="/login">立即登录</a>
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
