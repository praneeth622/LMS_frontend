"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: (string | number)[]
  redirectTo?: string
}

// Role mapping for convenience
const ROLE_MAP: Record<string, number> = {
  'admin': 1,
  'instructor': 2,
  'student': 3,
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (allowedRoles.length > 0 && userProfile) {
        const numericRoles = allowedRoles.map(role => 
          typeof role === 'string' ? ROLE_MAP[role] : role
        ).filter(Boolean)
        
        if (userProfile.role_id !== undefined && !numericRoles.includes(userProfile.role_id)) {
          // Redirect based on user role
          switch (userProfile.role_id) {
            case 1: // Admin
              router.push('/admin/dashboard')
              break
            case 2: // Instructor
              router.push('/instructor/dashboard')
              break
            case 3: // Student
              router.push('/student/dashboard')
              break
            default:
              router.push('/')
          }
          return
        }
      }
    }
  }, [user, userProfile, loading, allowedRoles, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedRoles.length > 0 && userProfile && userProfile.role_id !== undefined) {
    const numericRoles = allowedRoles.map(role => 
      typeof role === 'string' ? ROLE_MAP[role] : role
    ).filter(Boolean)
    
    if (!numericRoles.includes(userProfile.role_id)) {
      return null
    }
  }

  return <>{children}</>
}