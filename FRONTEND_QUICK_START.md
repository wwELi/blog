# 前端快速开始指南

## 登录流程

1. 前端跳转到 `/oauth2/authorization/github`
2. 用户被重定向到 GitHub 授权
3. GitHub 授权后，后端重定向到前端回调页面并携带 token
4. 前端从 URL 参数中获取 token 并保存

## React 完整示例

### 1. 创建认证服务

```typescript
// services/auth.ts
const API_BASE_URL = 'http://localhost:8080';

export const authService = {
  // 跳转到登录页面
  login: (redirectUri?: string) => {
    const callbackUrl = redirectUri || `${window.location.origin}/auth/callback`;
    window.location.href = `${API_BASE_URL}/oauth2/authorization/github?redirect_uri=${encodeURIComponent(callbackUrl)}`;
  },

  // 保存 Token
  saveToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  // 获取 Token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  },

  // 使用 Token 调用 API
  apiCall: async (url: string, options: RequestInit = {}) => {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      authService.logout();
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
```

### 2. 创建登录按钮组件

```typescript
// components/LoginButton.tsx
import { authService } from '../services/auth';

function LoginButton() {
  const handleLogin = () => {
    authService.login();
  };

  return (
    <button onClick={handleLogin}>
      使用 GitHub 登录
    </button>
  );
}

export default LoginButton;
```

### 3. 创建回调页面

```typescript
// pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');

    if (token) {
      authService.saveToken(token);
      // 跳转到主页
      navigate('/');
    } else {
      // 登录失败
      navigate('/login?error=true');
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <p>处理登录中...</p>
    </div>
  );
}

export default AuthCallback;
```

### 4. 创建路由配置

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginButton from './components/LoginButton';
import AuthCallback from './pages/AuthCallback';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<LoginButton />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 5. 使用 Token 调用 API

```typescript
// components/UserProfile.tsx
import { useState, useEffect } from 'react';
import { authService } from '../services/auth';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.apiCall('/user');
        setUser(data);
      } catch (error) {
        console.error('Failed to get user info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please login first</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Name: {user.name}</p>
      <button onClick={authService.logout}>Logout</button>
    </div>
  );
}

export default UserProfile;
```

## Vue 3 示例

```vue
<!-- components/LoginButton.vue -->
<template>
  <button @click="handleLogin">使用 GitHub 登录</button>
</template>

<script setup>
import { authService } from '../services/auth';

const handleLogin = () => {
  authService.login();
};
</script>
```

```vue
<!-- pages/AuthCallback.vue -->
<template>
  <div>处理登录中...</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '../services/auth';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const token = route.query.token;
  
  if (token) {
    authService.saveToken(token);
    router.push('/');
  } else {
    router.push('/login?error=true');
  }
});
</script>
```

## 使用示例

### 调用需要认证的接口

```typescript
// 获取用户信息
const userInfo = await authService.apiCall('/user');
console.log(userInfo);

// 调用其他需要认证的接口
const data = await authService.apiCall('/api/your-endpoint', {
  method: 'POST',
  body: JSON.stringify({ ... }),
});
```

## 配置说明

在 `application.yml` 中配置前端地址：

```yaml
app:
  frontend:
    url: http://localhost:3000  # 修改为你的前端地址
```

或通过环境变量：
```bash
export FRONTEND_URL=http://localhost:5173
```

## 完整流程

1. 用户点击"使用 GitHub 登录"按钮
2. 跳转到 `http://localhost:8080/oauth2/authorization/github?redirect_uri=http://localhost:3000/auth/callback`
3. GitHub 授权后，重定向到 `http://localhost:3000/auth/callback?token=xxx&username=xxx`
4. 前端从 URL 参数中提取 token 并保存到 localStorage
5. 后续 API 调用时，在 Header 中添加 `Authorization: Bearer <token>`

