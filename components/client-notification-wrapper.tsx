'use client'

import dynamic from 'next/dynamic'

// Dynamically import the client-only component
const NotificationWrapper = dynamic(() => import('@/contexts/NotificationWrapper'), {
  ssr: false,
})

export default function ClientNotificationWrapper({ children }: { children: React.ReactNode }) {
  return <NotificationWrapper>{children}</NotificationWrapper>
}
