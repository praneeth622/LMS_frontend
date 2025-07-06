import axios from 'axios'
import { supabase } from './supabase'

const API_BASE_URL = 'https://lmsnestjs-production.up.railway.app/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface User {
  id: number
  name: string
  email: string
  role_id: number
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

// Auth API functions
export const authApi = {
  createUser: async (userData: CreateUserRequest): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', userData)
    return response.data
  },

  getAllRoles: async (): Promise<ApiResponse<Role[]>> => {
    const response = await api.get('/users/roles/all')
    return response.data
  },

  // Get user by ID - this will be our workaround for getting current user profile
  getUserById: async (userId: number): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  healthCheck: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/health')
    return response.data
  },
}