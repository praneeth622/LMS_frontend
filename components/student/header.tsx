"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

interface StudentHeaderProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
}

export function StudentHeader({ 
  title, 
  subtitle, 
  searchPlaceholder = "Search...",
  onSearch 
}: StudentHeaderProps) {
  const { userProfile, signOut } = useAuth()
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
          {/* Search */}
          {onSearch && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 w-80 h-10 border-border rounded-lg bg-background text-sm font-medium placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
                style={{ fontSize: '0.875rem' }}
              />
            </div>
          )}

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 rounded-lg hover:bg-muted transition-colors"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground border-2 border-background rounded-full font-semibold">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-muted transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm border-2 border-background">
                  <span className="text-sm font-semibold text-primary-foreground">
                    {userProfile?.name?.charAt(0) || 'S'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-background border-border rounded-xl shadow-lg p-0" 
              align="end" 
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground leading-none">
                    {userProfile?.name || 'Student'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-none">
                    {userProfile?.email || 'student@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="p-3 text-sm font-medium text-foreground hover:bg-muted cursor-pointer">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 text-sm font-medium text-foreground hover:bg-muted cursor-pointer">
                Learning Preferences
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 text-sm font-medium text-foreground hover:bg-muted cursor-pointer">
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                onClick={signOut}
                className="p-3 text-sm font-medium text-primary hover:bg-muted cursor-pointer"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}