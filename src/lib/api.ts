import axios from 'axios'

// API base URL - switch between local backend and FakeStore API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true'

// FakeStore API for fallback
export const fakeStoreApi = axios.create({
  baseURL: 'https://fakestoreapi.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Main API client for backend
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies for refresh token
})

// Store access token in memory (not localStorage for security)
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await api.post('/auth/refresh')
        const newAccessToken = response.data.data.accessToken
        setAccessToken(newAccessToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        setAccessToken(null)
        window.dispatchEvent(new CustomEvent('auth:logout'))
        return Promise.reject(refreshError)
      }
    }

    // Handle errors globally
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.message)
    } else {
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

// Export which API to use based on config
export const useBackend = USE_BACKEND
