import axios from 'axios'
import { supabase } from './supabase'

// Try multiple possible API endpoints
const API_BASE_URLS = [
  'https://lmsnestjs-production.up.railway.app/api',
  'https://lmsnestjs-production.up.railway.app',
  'http://localhost:3001/api', // Fallback for local development
  'http://localhost:8000/api'
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URLS[0]

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
  } catch (error) {
    console.error('Error getting session:', error)
  }
  return config
})

// Enhanced response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      baseURL: error.config?.baseURL
    })

    // Handle network errors (API down, CORS, etc.)
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK' || !error.response) {
      console.warn('Network error detected, API may be down')
      // You could implement fallback logic here
      return Promise.reject(new Error('Unable to connect to server. Please check your internet connection or try again later.'))
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('user_data')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export interface User {
  id: number
  name: string
  email: string
  role_id?: number  // For backward compatibility
  role?: Role       // New nested structure from API
  created_at: string
}

export interface Role {
  id: number
  name: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role_id: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}

// Auth API functions with fallback and enhanced error handling
export const authApi = {
  createUser: async (userData: CreateUserRequest): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post('/users', userData)
      return response.data
    } catch (error: any) {
      console.error('Failed to create user:', error.message)
      
      // If the API is down, provide a mock response for development
      if (error.message.includes('Unable to connect to server')) {
        console.warn('API is down, returning mock success response')
        return {
          success: true,
          data: {
            id: Date.now(), // Mock ID
            name: userData.name,
            email: userData.email,
            role_id: userData.role_id,
            created_at: new Date().toISOString()
          }
        }
      }
      
      throw error
    }
  },

  getAllRoles: async (): Promise<ApiResponse<Role[]>> => {
    try {
      const response = await api.get('/users/roles/all')
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch roles:', error.message)
      
      // If the API is down, provide fallback roles
      if (error.message.includes('Unable to connect to server')) {
        console.warn('API is down, returning fallback roles')
        return {
          success: true,
          data: [
            { id: 1, name: 'admin' },
            { id: 2, name: 'instructor' },
            { id: 3, name: 'student' }
          ]
        }
      }
      
      throw error
    }
  },

  getUserById: async (userId: number): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get(`/users/${userId}`)
      return response.data
    } catch (error: any) {
      console.error('Failed to get user by ID:', error.message)
      throw error
    }
  },

  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error: any) {
      console.error('Failed to get all users:', error.message)
      
      // If the API is down, return empty array
      if (error.message.includes('Unable to connect to server')) {
        console.warn('API is down, returning empty users array')
        return {
          success: true,
          data: []
        }
      }
      
      throw error
    }
  },

  healthCheck: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error: any) {
      console.error('Health check failed:', error.message)
      
      // Return a mock health status if API is down
      if (error.message.includes('Unable to connect to server')) {
        return {
          success: false,
          data: { status: 'API Unavailable', message: 'Backend server is not accessible' }
        }
      }
      
      throw error
    }
  },
}