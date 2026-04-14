/**
 * API 服务
 */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://api.moluyao.com/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 Token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token 过期，尝试刷新
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          await AsyncStorage.setItem('access_token', res.access_token);
          await AsyncStorage.setItem('refresh_token', res.refresh_token);
          // 重试原请求
          error.config.headers.Authorization = `Bearer ${res.access_token}`;
          return api.request(error.config);
        } catch (e) {
          // 刷新失败，清除 Token
          await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        }
      }
    }
    return Promise.reject(error);
  }
);

// ============ 认证 ============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/auth/login', formData.toString(), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
  },
  getMe: () => api.get('/auth/me'),
};

// ============ 对话 ============
export const chatAPI = {
  createSession: (title) => api.post('/chat/sessions', { title }),
  listSessions: () => api.get('/chat/sessions'),
  getSession: (id) => api.get(`/chat/session/${id}`),
  deleteSession: (id) => api.delete(`/chat/session/${id}`),
  sendMessage: (sessionId, content) => 
    api.post(`/chat/session/${sessionId}/message`, { content }),
};

// ============ 智囊 ============
export const brainAPI = {
  createTask: (data) => api.post('/brain/tasks', data),
  listTasks: (params) => api.get('/brain/tasks', { params }),
  getTask: (id) => api.get(`/brain/task/${id}`),
  updateTask: (id, data) => api.put(`/brain/task/${id}`, data),
  deleteTask: (id) => api.delete(`/brain/task/${id}`),
  executeTask: (id) => api.post(`/brain/task/${id}/execute`),
};

// ============ 反馈 ============
export const feedbackAPI = {
  create: (data) => api.post('/feedback', data),
  myList: () => api.get('/feedback/my'),
};

export default api;
