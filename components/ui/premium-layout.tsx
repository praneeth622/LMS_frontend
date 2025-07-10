"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Menu, X, Bell, Search, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"

interface PremiumLayoutProps {
  children: React.ReactNode
  role?: "student" | "instructor" | "admin"
  className?: string
}

export function PremiumLayout({ 
  children, 
  role = "student",
  className 
}: PremiumLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  
  const roleClasses = {
    student: "bg-student",
    instructor: "bg-instructor",
    admin: "bg-admin"
  }
  
  const roleGradients = {
    student: "gradient-primary",
    instructor: "gradient-instructor",
    admin: "gradient-admin"
  }
  
  const roleTextGradients = {
    student: "text-gradient-primary",
    instructor: "text-gradient-instructor",
    admin: "text-gradient-admin"
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      roleClasses[role],
      className
    )}>
      {/* Premium Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-border">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                roleGradients[role]
              )}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className={cn(
                "text-xl font-bold hidden md:block",
                roleTextGradients[role]
              )}>
                EduFlow
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] lg:w-[300px] pl-8 bg-background"
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {}}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback className={cn(roleGradients[role], "text-white")}>
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background border-r border-border p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                roleGradients[role]
              )}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className={cn(
                "text-xl font-bold",
                roleTextGradients[role]
              )}>
                EduFlow
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="space-y-2">
            {/* Navigation items would go here */}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

interface PremiumSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function PremiumSection({ 
  title, 
  description, 
  children, 
  className 
}: PremiumSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

interface PremiumGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function PremiumGrid({ 
  children, 
  columns = 3, 
  className 
}: PremiumGridProps) {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <div className={cn(
      "grid gap-6",
      columnClasses[columns],
      className
    )}>
      {children}
    </div>
  )
}
