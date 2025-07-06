// app/components/layout/NotificationWrapper.tsx
'use client'

import React from 'react'
import { ToastNotifications } from '@/components/notifications/toast-notifications'
import { useNotifications } from '@/contexts/notification-context'

export default function NotificationWrapper({ children }: { children: React.ReactNode }) {
  const { toastNotifications, removeToast } = useNotifications()

  return (
    <>
      {children}
      <ToastNotifications
        notifications={toastNotifications}
        onRemove={removeToast}
      />
    </>
  )
}
