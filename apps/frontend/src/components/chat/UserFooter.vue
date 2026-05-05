<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown, Modal, message } from 'ant-design-vue'
import { UserOutlined, UpOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '../../store/auth'
import { useRouter } from 'vue-router'
import { changePassword } from '../../apis/auth'

const authStore = useAuthStore()
const router = useRouter()

const items = [
  {
    key: 'logout',
    label: '退出登录',
    danger: true
  },
  {
    key: 'changePassword',
    label: '修改密码',
    danger: false
  }
]

const passwordModalVisible = ref(false)
const logoutModalVisible = ref(false)
const logoutLoading = ref(false)
const formState = ref({
  oldPassword: '',
  newPassword: ''
})
const loading = ref(false)

const handleMenuClick = async ({ key }: { key: string }) => {
  if (key === 'logout') {
    logoutModalVisible.value = true
  } else if (key === 'changePassword') {
    passwordModalVisible.value = true
  }
}

const handleLogoutConfirm = async () => {
  logoutLoading.value = true
  try {
    await authStore.logout()
    message.success('登出成功')
    router.push('/login')
  } catch {
    message.error('登出失败')
  } finally {
    logoutLoading.value = false
    logoutModalVisible.value = false
  }
}

const handlePasswordSubmit = async () => {
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
    passwordModalVisible.value = false
    formState.value = { oldPassword: '', newPassword: '' }
  } finally {
    loading.value = false
  }
}

const handlePasswordCancel = () => {
  passwordModalVisible.value = false
  formState.value = { oldPassword: '', newPassword: '' }
}
</script>

<template>
  <div class="user-footer">
    <Dropdown :trigger="['click']" placement="topLeft">
      <div class="user-info">
        <UserOutlined />
        <span class="username">{{ authStore.userInfo?.username || '用户' }}</span>
        <UpOutlined class="arrow" />
      </div>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item v-for="item in items" :key="item.key" :danger="item.danger">
            {{ item.label }}
          </a-menu-item>
        </a-menu>
      </template>
    </Dropdown>
    <Modal v-model:open="passwordModalVisible" title="修改密码" :confirm-loading="loading" @ok="handlePasswordSubmit"
      @cancel="handlePasswordCancel" ok-text="确认" cancel-text="取消">
      <a-form :model="formState" layout="vertical">
        <a-form-item label="当前密码">
          <a-input-password v-model:value="formState.oldPassword" placeholder="请输入当前密码" size="large" />
        </a-form-item>
        <a-form-item label="新密码">
          <a-input-password v-model:value="formState.newPassword" placeholder="请输入新密码（6-20字符）" size="large" />
        </a-form-item>
      </a-form>
    </Modal>
    <Modal v-model:open="logoutModalVisible" title="确认退出登录？" :confirm-loading="logoutLoading" @ok="handleLogoutConfirm"
      ok-text="确认" cancel-text="取消">
      退出登录不会丢失任何数据，你仍可以登录此账号。
    </Modal>
  </div>
</template>

<style scoped>
.user-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f0f0f0;
}

.username {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.arrow {
  font-size: 1em;
  color: #999;
}
</style>