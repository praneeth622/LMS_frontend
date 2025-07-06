import { supabase } from './supabase'
import { api, authApi, User, Role } from './api'

export type { User, Role }

export interface AuthResponse {
  success: boolean
  data: User
}

// Supabase Auth Functions
export const signUp = async (email: string, password: string, userData: { name: string; role_id: number }) => {
  try {
    console.log('🔐 Starting sign up process for:', email)
    
    // First, sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error('❌ Supabase auth signup error:', authError)
      throw authError
    }

    console.log('✅ Supabase signup successful, creating user in backend...')

    // Then create user in our backend using the configured API instance
    const response = await authApi.createUser({
      name: userData.name,
      email,
      password,
      role_id: userData.role_id
    })

    console.log('✅ Backend user creation successful:', response)
    return { data: response, error: null }
  } catch (error: any) {
    console.error('❌ Sign up failed:', error)
    return { data: null, error: error.message || 'Registration failed' }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    console.log('🔐 Starting sign in process for:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('❌ Supabase auth signin error:', error)
      throw error
    }

    console.log('✅ Supabase signin successful:', data.user?.email)
    return { data, error: null }
  } catch (error: any) {
    console.error('❌ Sign in failed:', error)
    return { data: null, error: error.message || 'Login failed' }
  }
}

export const signOut = async () => {
  console.log('🔐 Starting sign out process...')
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('❌ Sign out error:', error)
  } else {
    console.log('✅ Sign out successful')
  }
  return { error }
}

export const getCurrentUser = async () => {
  console.log('👤 Getting current user from Supabase...')
  const { data: { user } } = await supabase.auth.getUser()
  console.log('👤 Current user:', user?.email || 'No user')
  return user
}

export const getSession = async () => {
  console.log('🎫 Getting current session from Supabase...')
  const { data: { session } } = await supabase.auth.getSession()
  console.log('🎫 Current session:', session?.user?.email || 'No session')
  return session
}

// API Functions using the configured API instance
export const getAllRoles = async (): Promise<Role[]> => {
  try {
    console.log('🎭 Fetching all roles...')
    const response = await authApi.getAllRoles()
    console.log('✅ Roles fetched successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Failed to fetch roles:', error)
    return []
  }
}

export const getUserProfile = async (email: string): Promise<User | null> => {
  try {
    console.log('👤 Fetching user profile for email:', email)
    
    // TEMPORARY WORKAROUND: Since there's no /users/me endpoint, we'll use a different approach
    // We'll store the user ID in localStorage during login and use getUserById
    const storedUserData = localStorage.getItem('user_data')
    
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData)
        console.log('📱 Found stored user data:', userData)
        
        if (userData.id) {
          console.log('🔍 Fetching user by ID:', userData.id)
          const response = await authApi.getUserById(userData.id)
          
          if (response.success) {
            console.log('✅ User profile fetched successfully:', {
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              role_id: response.data.role_id
            })
            return response.data
          } else {
            console.error('❌ Failed to fetch user by ID:', response)
          }
        }
      } catch (parseError) {
        console.error('❌ Error parsing stored user data:', parseError)
        localStorage.removeItem('user_data')
      }
    }
    
    console.warn('⚠️ No stored user data found or failed to fetch by ID')
    console.warn('💡 This indicates the user needs to log in again to store their profile data')
    
    return null
  } catch (error: any) {
    console.error('❌ Failed to fetch user profile:', {
      email,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    })
    
    // Check if it's a permission error
    if (error.response?.status === 401) {
      console.error('🚫 Unauthorized: Token may be invalid or expired')
      localStorage.removeItem('user_data')
    } else if (error.response?.status === 403) {
      console.error('🚫 Forbidden: User may not have permission to access this resource')
    } else if (error.response?.status === 404) {
      console.error('🔍 Not Found: User profile not found')
    }
    
    return null
  }
}

// Helper function to store user data after successful login
export const storeUserData = (userData: User) => {
  console.log('💾 Storing user data in localStorage:', {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role_id: userData.role_id
  })
  localStorage.setItem('user_data', JSON.stringify(userData))
}

// Helper function to clear stored user data
export const clearUserData = () => {
  console.log('🧹 Clearing stored user data')
  localStorage.removeItem('user_data')
}