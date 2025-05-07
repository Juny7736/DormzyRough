import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Properties API
export const propertiesApi = {
  getAll: (params?: any) => api.get('/properties', { params }),
  getById: (id: string) => api.get(`/properties/${id}`),
  getByHostId: (hostId: string) => api.get(`/properties/host/${hostId}`),
  create: (data: any) => api.post('/properties', data),
  update: (id: string, data: any) => api.put(`/properties/${id}`, data)
};

// Users API
export const usersApi = {
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  checkEmail: (email: string) => api.get(`/users/check-email/${email}`)
};

// Messages API
export const messagesApi = {
  getConversations: (userId: string) => api.get(`/messages/conversations/${userId}`),
  getMessages: (conversationId: string) => api.get(`/messages/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, data: any) => api.post(`/messages/conversations/${conversationId}/messages`, data),
  createConversation: (data: any) => api.post('/messages/conversations', data),
  markAsRead: (conversationId: string, userId: string) => api.put(`/messages/conversations/${conversationId}/read`, { userId })
};

// Posts API
export const postsApi = {
  getAll: (params?: any) => api.get('/posts', { params }),
  getById: (id: string) => api.get(`/posts/${id}`),
  getByUserId: (userId: string) => api.get(`/posts/user/${userId}`),
  create: (data: any) => api.post('/posts', data),
  addComment: (postId: string, data: any) => api.post(`/posts/${postId}/comments`, data)
};

export default api;