import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const startInterview = (data) => api.post('/interview/start', data)
export const getSessions = () => api.get('/interview/sessions')
export const getSession = (id) => api.get(`/interview/sessions/${id}`)
export const submitAnswer = (id, data) => api.post(`/interview/sessions/${id}/answer`, data)
export const completeSession = (id) => api.post(`/interview/sessions/${id}/complete`)

export default api