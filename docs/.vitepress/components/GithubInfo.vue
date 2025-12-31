<template>
  <div class="custom-card">
    <div v-if="!isAuthenticated">
      <button @click="handleLogin" class="login-btn">
        使用 GitHub 登录
      </button>
    </div>
    
    <div v-else class="user-info">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="user" class="user-details">
        <h3>用户信息</h3>
        <p><strong>用户名:</strong> {{ user.username }}</p>
        <p v-if="user.email"><strong>邮箱:</strong> {{ user.email }}</p>
        <p v-if="user.name"><strong>姓名:</strong> {{ user.name }}</p>
        <button @click="handleLogout" class="logout-btn">登出</button>
      </div>
      <div v-else class="error">
        <p>获取用户信息失败</p>
        <button @click="handleLogin" class="login-btn">重新登录</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authService } from '../utils/auth';

const isAuthenticated = ref(false);
const loading = ref(false);
const user = ref(null);

// 检查登录状态并获取用户信息
const checkAuthAndFetchUser = async () => {
  // 先检查 URL 参数中是否有 token（回调处理）
  const { token, username } = authService.extractTokenFromUrl();
  if (token) {
    authService.saveToken(token);
    // 清除 URL 参数
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      url.searchParams.delete('username');
      window.history.replaceState({}, '', url.toString());
    }
  }

  // 检查是否已登录
  isAuthenticated.value = authService.isAuthenticated();
  
  if (isAuthenticated.value) {
    await fetchUserInfo();
  }
};

// 获取用户信息
const fetchUserInfo = async () => {
  loading.value = true;
  try {
    const userData = await authService.apiCall('/user');
    user.value = userData;
  } catch (error) {
    console.error('Failed to get user info:', error);
    user.value = null;
    // 如果 token 无效，清除登录状态
    if (error.message === 'Unauthorized' || error.message === 'Not authenticated') {
      isAuthenticated.value = false;
    }
  } finally {
    loading.value = false;
  }
};

// 处理登录
const handleLogin = () => {
  authService.login();
};

// 处理登出
const handleLogout = () => {
  authService.logout();
};

// 组件挂载时检查登录状态
onMounted(() => {
  checkAuthAndFetchUser();
});
</script>

<style scoped>
.custom-card {
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.login-btn,
.logout-btn {
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.login-btn:hover,
.logout-btn:hover {
  background: var(--vp-c-brand-dark);
}

.logout-btn {
  margin-top: 1rem;
  background: var(--vp-c-danger);
}

.logout-btn:hover {
  background: var(--vp-c-danger-dark);
}

.user-info {
  margin-top: 0;
}

.user-details h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.user-details p {
  margin: 0.5rem 0;
  color: var(--vp-c-text-2);
}

.loading {
  color: var(--vp-c-text-2);
  text-align: center;
  padding: 1rem;
}

.error {
  color: var(--vp-c-danger);
  text-align: center;
}

.error p {
  margin-bottom: 1rem;
}
</style>