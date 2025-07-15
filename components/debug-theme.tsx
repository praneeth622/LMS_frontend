"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function DebugTheme() {
  const { theme, setTheme, resolvedTheme, themes } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [htmlClass, setHtmlClass] = useState('')

  useEffect(() => {
    setMounted(true)
    
    // Check HTML class every second
    const interval = setInterval(() => {
      if (typeof document !== 'undefined') {
        setHtmlClass(document.documentElement.className)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const forceTheme = (themeName: string) => {
    // Force apply theme directly to DOM
    if (typeof document !== 'undefined') {
      document.documentElement.className = themeName
      document.documentElement.setAttribute('data-theme', themeName)
    }
    setTheme(themeName)
  }

  if (!mounted) {
    return <div>Loading theme debug...</div>
  }

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-background border rounded-lg shadow-lg z-50 text-xs max-w-sm">
      <h3 className="font-bold mb-2">Theme Debug</h3>
      <div>Current theme: {theme}</div>
      <div>Resolved theme: {resolvedTheme}</div>
      <div>Available themes: {themes.join(', ')}</div>
      <div>HTML class: {htmlClass}</div>
      <div className="mt-2 space-x-2">
        <button 
          onClick={() => forceTheme('light')}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Light
        </button>
        <button 
          onClick={() => forceTheme('dark')}
          className="px-2 py-1 bg-gray-800 text-white rounded text-xs"
        >
          Dark
        </button>
        <button 
          onClick={() => forceTheme('system')}
          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
        >
          System
        </button>
      </div>
      <div className="mt-2">
        <button 
          onClick={() => {
            console.log('Theme state:', { theme, resolvedTheme, themes })
            console.log('HTML element:', document.documentElement.className)
          }}
          className="px-2 py-1 bg-purple-500 text-white rounded text-xs"
        >
          Console Log
        </button>
      </div>
    </div>
  )
}
