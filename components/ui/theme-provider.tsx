"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Fix for Next.js 15 hydration issues
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a minimal version during SSR to prevent hydration mismatch
    return <div suppressHydrationWarning>{children}</div>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}