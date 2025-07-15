"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

interface ExtendedThemeContextType {
  theme: string | undefined
  setTheme: (theme: string) => void
  resolvedTheme: string | undefined
  systemTheme: string | undefined
  isDark: boolean
  isLight: boolean
  isSystem: boolean
  toggleTheme: () => void
  themeLoaded: boolean
  accentColor: string
  setAccentColor: (color: string) => void
  fontSize: string
  setFontSize: (size: string) => void
  animations: boolean
  setAnimations: (enabled: boolean) => void
}

const ExtendedThemeContext = createContext<ExtendedThemeContextType | undefined>(undefined)

interface ExtendedThemeProviderProps {
  children: React.ReactNode
}

const accentColors = {
  red: 'hsl(0 72.2% 50.6%)',
  blue: 'hsl(221 72.2% 50.6%)',
  green: 'hsl(142 71% 45%)',
  purple: 'hsl(262 72.2% 50.6%)',
  orange: 'hsl(25 72.2% 50.6%)',
  pink: 'hsl(329 72.2% 50.6%)',
  yellow: 'hsl(48 72.2% 50.6%)',
}

const fontSizes = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
}

export function ExtendedThemeProvider({ children }: ExtendedThemeProviderProps) {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)
  const [accentColor, setAccentColorState] = useState('red')
  const [fontSize, setFontSizeState] = useState('base')
  const [animations, setAnimationsState] = useState(true)

  // Load preferences from localStorage and mark as mounted
  useEffect(() => {
    const savedAccentColor = localStorage.getItem('theme-accent-color')
    const savedFontSize = localStorage.getItem('theme-font-size')
    const savedAnimations = localStorage.getItem('theme-animations')

    if (savedAccentColor && accentColors[savedAccentColor as keyof typeof accentColors]) {
      setAccentColorState(savedAccentColor)
    }
    if (savedFontSize && fontSizes[savedFontSize as keyof typeof fontSizes]) {
      setFontSizeState(savedFontSize)
    }
    if (savedAnimations !== null) {
      setAnimationsState(savedAnimations === 'true')
    }

    setMounted(true)
  }, [])

  // Theme is loaded when component is mounted and next-themes has resolved the theme
  const themeLoaded = mounted && resolvedTheme !== undefined

  // Apply accent color to CSS custom properties
  useEffect(() => {
    if (themeLoaded) {
      const root = document.documentElement
      const color = accentColors[accentColor as keyof typeof accentColors]
      
      if (color) {
        root.style.setProperty('--primary', color.replace('hsl(', '').replace(')', ''))
      }
    }
  }, [accentColor, themeLoaded])

  // Apply font size to CSS
  useEffect(() => {
    if (themeLoaded) {
      const root = document.documentElement
      const size = fontSizes[fontSize as keyof typeof fontSizes]
      
      if (size) {
        root.style.setProperty('--base-font-size', size)
        root.style.fontSize = size
      }
    }
  }, [fontSize, themeLoaded])

  // Apply animations preference
  useEffect(() => {
    if (themeLoaded) {
      const root = document.documentElement
      
      if (!animations) {
        root.style.setProperty('--animation-duration', '0.01ms')
        root.classList.add('reduce-motion')
      } else {
        root.style.removeProperty('--animation-duration')
        root.classList.remove('reduce-motion')
      }
    }
  }, [animations, themeLoaded])

  const setAccentColor = (color: string) => {
    setAccentColorState(color)
    localStorage.setItem('theme-accent-color', color)
  }

  const setFontSize = (size: string) => {
    setFontSizeState(size)
    localStorage.setItem('theme-font-size', size)
  }

  const setAnimations = (enabled: boolean) => {
    setAnimationsState(enabled)
    localStorage.setItem('theme-animations', enabled.toString())
  }

  const toggleTheme = () => {
    if (resolvedTheme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  const isDark = resolvedTheme === 'dark'
  const isLight = resolvedTheme === 'light'
  const isSystem = theme === 'system'

  const value: ExtendedThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    isDark,
    isLight,
    isSystem,
    toggleTheme,
    themeLoaded,
    accentColor,
    setAccentColor,
    fontSize,
    setFontSize,
    animations,
    setAnimations,
  }

  return (
    <ExtendedThemeContext.Provider value={value}>
      {children}
    </ExtendedThemeContext.Provider>
  )
}

export function useExtendedTheme() {
  const context = useContext(ExtendedThemeContext)
  if (context === undefined) {
    throw new Error('useExtendedTheme must be used within an ExtendedThemeProvider')
  }
  return context
}

// Theme transition wrapper component
interface ThemeTransitionProps {
  children: React.ReactNode
  className?: string
}

export function ThemeTransition({ children, className }: ThemeTransitionProps) {
  const { resolvedTheme, themeLoaded, animations } = useExtendedTheme()

  if (!themeLoaded) {
    return (
      <div className={`opacity-0 ${className || ''}`}>
        {children}
      </div>
    )
  }

  if (!animations) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={resolvedTheme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Theme loading placeholder
export function ThemeLoadingPlaceholder({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className || 'h-4 w-20'}`} />
  )
}
