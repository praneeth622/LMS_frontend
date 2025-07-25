"use client"

import * as React from "react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={[1]}>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}