"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && userProfile) {
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
    }
  }, [userProfile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return null
}