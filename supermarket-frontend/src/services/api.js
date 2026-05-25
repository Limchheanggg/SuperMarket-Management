import axios from 'axios'
const API = axios.create({ baseURL: 'http://127.0.0.1:8000', headers: { 'Content-Type': 'application/json' } })
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export const login = (data) => API.post('/api/auth/login', data)
export const register = (data) => API.post('/api/auth/register', data)
export const getMe = () => API.get('/api/auth/me')
export const getProducts = (params) => API.get('/api/products', { params })
export const getProduct = (id) => API.get(`/api/products/${id}`)
export const getCategories = () => API.get('/api/categories')
export const getCart = () => API.get('/api/cart')
export const addToCart = (data) => API.post('/api/cart', data)
export const removeFromCart = (id) => API.delete(`/api/cart/${id}`)
export const getOrders = () => API.get('/api/orders')
export const createOrder = (data) => API.post('/api/orders', data)
export default API
