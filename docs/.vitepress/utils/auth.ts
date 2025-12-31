// 认证服务工具函数
const API_BASE_URL = '/api'; // 通过 nginx 代理到后端

export const authService = {
  // 跳转到登录页面
  login: (redirectUri?: string) => {
    const callbackUrl = redirectUri || `${window.location.origin}${window.location.pathname}`;
    window.location.href = `http://39.107.213.48:8080/oauth2/authorization/github?redirect_uri=${encodeURIComponent(callbackUrl)}`;
  },

  // 保存 Token
  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  // 获取 Token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },

  // 登出
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.reload();
    }
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

  // 从 URL 参数中提取 token（用于回调处理）
  extractTokenFromUrl: (): { token: string | null; username: string | null } => {
    if (typeof window === 'undefined') {
      return { token: null, username: null };
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username');
    
    return { token, username };
  },
};

