"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Moon, Sun, Monitor, Palette, X } from 'lucide-react'
import { useExtendedTheme } from '@/contexts/extended-theme-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FloatingThemeToggleProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
}

const accentColors = [
  { name: 'Amber', value: 'amber', color: 'bg-amber-500' },
  { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
  { name: 'Green', value: 'green', color: 'bg-green-500' },
  { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
  { name: 'Pink', value: 'pink', color: 'bg-pink-500' },
]

export function FloatingThemeToggle({ 
  position = 'bottom-right',
  className 
}: FloatingThemeToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const {
    theme,
    setTheme,
    resolvedTheme,
    accentColor,
    setAccentColor,
    animations,
    setAnimations,
    themeLoaded
  } = useExtendedTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !themeLoaded) {
    return null
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  }

  const panelPositions = {
    'bottom-right': 'bottom-16 right-0',
    'bottom-left': 'bottom-16 left-0',
    'top-right': 'top-16 right-0',
    'top-left': 'top-16 left-0',
  }

  return (
    <div className={cn(
      'fixed z-50',
      positionClasses[position],
      className
    )}>
      <div className="relative">
        {/* Main Toggle Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full shadow-lg backdrop-blur-xl border-border/50",
              "bg-background/80 hover:bg-background/90",
              "transition-all duration-300"
            )}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? (
                <X className="h-5 w-5" />
              ) : (
                <Settings className="h-5 w-5" />
              )}
            </motion.div>
          </Button>
        </motion.div>

        {/* Expanded Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                'absolute',
                panelPositions[position]
              )}
            >
              <Card className="w-80 shadow-2xl backdrop-blur-xl bg-background/95 border-border/50">
                <CardContent className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Quick Theme</h3>
                  </div>

                  {/* Theme Mode */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Appearance</Label>
                    <div className="flex gap-2">
                      {[
                        { value: 'light', icon: Sun, label: 'Light' },
                        { value: 'dark', icon: Moon, label: 'Dark' },
                        { value: 'system', icon: Monitor, label: 'Auto' }
                      ].map(({ value, icon: Icon, label }) => (
                        <Button
                          key={value}
                          variant={theme === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTheme(value)}
                          className="flex-1 gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Colors */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Accent Color</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {accentColors.map((color) => (
                        <motion.button
                          key={color.value}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setAccentColor(color.value)}
                          className={cn(
                            "relative h-8 w-8 rounded-lg border-2 transition-all",
                            accentColor === color.value
                              ? "border-foreground scale-110"
                              : "border-transparent hover:border-border"
                          )}
                          title={color.name}
                        >
                          <div className={cn(
                            "h-full w-full rounded-md",
                            color.color
                          )} />
                          {accentColor === color.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="h-2 w-2 rounded-full bg-white shadow-sm" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Animations Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Animations</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable smooth transitions
                      </p>
                    </div>
                    <Switch
                      checked={animations}
                      onCheckedChange={setAnimations}
                    />
                  </div>

                  {/* Current Theme Indicator */}
                  <div className="flex items-center justify-center pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {resolvedTheme === 'dark' ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                      <span className="capitalize">{resolvedTheme} theme active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Simpler floating toggle that just switches between light/dark
export function SimpleFloatingToggle({ 
  position = 'bottom-right',
  className 
}: FloatingThemeToggleProps) {
  const { toggleTheme, resolvedTheme, themeLoaded } = useExtendedTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !themeLoaded) {
    return null
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={cn(
        'fixed z-50',
        positionClasses[position],
        className
      )}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={toggleTheme}
          size="icon"
          className={cn(
            "h-12 w-12 rounded-full shadow-lg backdrop-blur-xl border-border/50",
            "bg-background/80 hover:bg-background/90",
            "transition-all duration-300"
          )}
        >
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 180, scale: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="h-5 w-5 text-blue-400" />
            ) : (
              <Sun className="h-5 w-5 text-amber-500" />
            )}
          </motion.div>
        </Button>
      </motion.div>
    </motion.div>
  )
}
