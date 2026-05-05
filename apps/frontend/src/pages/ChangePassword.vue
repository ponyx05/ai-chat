<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { message } from 'ant-design-vue'
import { changePassword } from '../apis/auth'

const router: Router = useRouter()

const formState = ref({
  oldPassword: '',
  newPassword: ''
})

const loading = ref(false)

const handleSubmit = async () => {
  if (!formState.value.oldPassword || !formState.value.newPassword) {
    message.warning('请填写所有字段')
    return
  }
  if (formState.value.newPassword.length < 6) {
    message.warning('新密码至少6位')
    return
  }

  loading.value = true
  try {
    await changePassword({
      oldPassword: formState.value.oldPassword,
      newPassword: formState.value.newPassword
    })
    message.success('密码修改成功')
    router.push('/home')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="change-password-container">
    <a-card class="change-password-card">
      <h2 class="card-title">修改密码</h2>
      <a-form :model="formState" @finish="handleSubmit">
        <a-form-item name="oldPassword">
          <a-input-password v-model:value="formState.oldPassword" placeholder="当前密码" size="large" />
        </a-form-item>
        <a-form-item name="newPassword">
          <a-input-password v-model:value="formState.newPassword" placeholder="新密码（6-20字符）" size="large" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              确认修改
            </a-button>
            <a-button @click="router.push('/home')">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
.change-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.change-password-card {
  width: 400px;
}

.card-title {
  text-align: center;
  margin-bottom: 24px;
}
</style>
