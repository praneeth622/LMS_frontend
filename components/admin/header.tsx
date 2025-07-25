"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface AdminHeaderProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  action?: React.ReactNode // Added action prop
}

export function AdminHeader({ 
  title, 
  subtitle, 
  searchPlaceholder = "Search...",
  onSearch,
  action // Destructure the action prop
}: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background border-b border-border px-8 py-6 shadow-sm"
      style={{ 
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        height: '4rem'
      }}
    >
      <div className="flex items-center justify-between h-full">
        <div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1 text-sm font-medium">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {action /* Render the action prop if provided */}
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 w-80 h-10 border-border rounded-lg bg-background text-sm font-medium placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
              style={{ fontSize: '0.875rem' }}
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-10 w-10 rounded-lg hover:bg-accent transition-colors"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground border-2 border-background rounded-full font-semibold"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-80 bg-popover border-border rounded-xl shadow-lg p-0"
            >
              <div className="p-4">
                <h4 className="font-semibold mb-3 text-popover-foreground">Notifications</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted border border-border">
                    <p className="text-sm font-semibold text-foreground">New user registration</p>
                    <p className="text-xs text-muted-foreground mt-1">John Doe registered as a student</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted border border-border">
                    <p className="text-sm font-semibold text-foreground">Course approval needed</p>
                    <p className="text-xs text-muted-foreground mt-1">React Fundamentals pending review</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted border border-border">
                    <p className="text-sm font-semibold text-foreground">System update</p>
                    <p className="text-xs text-muted-foreground mt-1">Database backup completed</p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="p-4 text-sm font-medium text-primary hover:bg-accent cursor-pointer">
                <span>View all notifications</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-10 w-10 rounded-lg hover:bg-accent transition-colors"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </motion.header>
  )
}