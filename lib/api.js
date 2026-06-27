import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Recipe API
export const recipeAPI = {
  createRecipe: (data) => api.post('/recipes', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getRecipes: (params) => api.get('/recipes', { params }),
  getRecipeById: (id) => api.get(`/recipes/${id}`),
  updateRecipe: (id, data) => api.put(`/recipes/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteRecipe: (id) => api.delete(`/recipes/${id}`),
  rateRecipe: (id, data) => api.post(`/recipes/${id}/rate`, data),
  getUserRecipes: (userId, params) => api.get(`/recipes/user/${userId}`, { params }),
};

export default api;
