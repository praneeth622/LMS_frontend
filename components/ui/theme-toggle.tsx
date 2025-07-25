"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Palette, Settings2 } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        className="h-9 w-9 hover:bg-accent/50"
        disabled
      >
        <div className="h-[1.2rem] w-[1.2rem] animate-pulse bg-muted rounded" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9 hover:bg-accent/50 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
        >
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {resolvedTheme === "dark" ? (
              <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
            ) : (
              <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
            )}
          </motion.div>
          
          {/* Hover effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[180px] p-2 backdrop-blur-xl bg-background/95 border border-border/50 shadow-xl"
        sideOffset={5}
      >
        <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Palette className="h-4 w-4" />
          Theme Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-3 cursor-pointer rounded-lg p-3 transition-all duration-200",
            theme === "light" 
              ? "bg-primary/10 text-primary border border-primary/20" 
              : "hover:bg-accent/50"
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
            <Sun className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Light</span>
            <span className="text-xs text-muted-foreground">Bright and clean</span>
          </div>
          {theme === "light" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-2 w-2 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-3 cursor-pointer rounded-lg p-3 transition-all duration-200",
            theme === "dark" 
              ? "bg-primary/10 text-primary border border-primary/20" 
              : "hover:bg-accent/50"
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 shadow-md">
            <Moon className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Dark</span>
            <span className="text-xs text-muted-foreground">Easy on the eyes</span>
          </div>
          {theme === "dark" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-2 w-2 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-3 cursor-pointer rounded-lg p-3 transition-all duration-200",
            theme === "system" 
              ? "bg-primary/10 text-primary border border-primary/20" 
              : "hover:bg-accent/50"
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 shadow-md">
            <Monitor className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">System</span>
            <span className="text-xs text-muted-foreground">Follow OS setting</span>
          </div>
          {theme === "system" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-2 w-2 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Enhanced simple toggle with smooth animations
export function SimpleThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 hover:bg-accent/50"
        disabled
      >
        <div className="h-[1.2rem] w-[1.2rem] animate-pulse bg-muted rounded" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 hover:bg-accent/50 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
    >
      <motion.div
        key={resolvedTheme}
        initial={{ rotate: -180, scale: 0, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 180, scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
        )}
      </motion.div>
      
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 rounded-md"
        animate={{
          background: resolvedTheme === "dark" 
            ? "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))"
            : "linear-gradient(45deg, rgba(251, 191, 36, 0.1), rgba(249, 115, 22, 0.1))"
        }}
        transition={{ duration: 0.3 }}
      />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Compact theme toggle for tight spaces
export function CompactThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-6 w-6 animate-pulse bg-muted rounded" />
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="h-6 w-6 rounded-md hover:bg-accent/50 transition-all duration-200 flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={resolvedTheme}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4 text-blue-400" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
