"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Palette, Sparkles, Zap, Eye } from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FloatingThemeToggle } from '@/components/ui/floating-theme-toggle'
import { ThemeTransition, useExtendedTheme } from '@/contexts/extended-theme-context'

export function ThemeShowcase() {
  const { resolvedTheme, accentColor, animations } = useExtendedTheme()

  const features = [
    {
      icon: Eye,
      title: 'Smart Theme Detection',
      description: 'Automatically adapts to your system preferences or choose manually',
      color: 'text-blue-500'
    },
    {
      icon: Palette,
      title: 'Custom Accent Colors',
      description: 'Personalize your experience with 7 beautiful accent color options',
      color: 'text-purple-500'
    },
    {
      icon: Zap,
      title: 'Smooth Animations',
      description: 'Buttery smooth transitions and micro-interactions throughout',
      color: 'text-amber-500'
    },
    {
      icon: Sparkles,
      title: 'Enhanced Dark Mode',
      description: 'Beautiful dark mode with improved contrast and readability',
      color: 'text-green-500'
    }
  ]

  return (
    <ThemeTransition className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-2 text-sm font-semibold">
            ✨ New Theme System
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Personalize Your Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Switch between light and dark themes, customize accent colors, and adjust settings 
            to create the perfect learning environment for you.
          </p>
        </motion.div>

        {/* Current Theme Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="mx-auto max-w-md text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Current Settings</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Theme:</span>
                  <Badge variant="secondary" className="capitalize">
                    {resolvedTheme}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Accent:</span>
                  <Badge variant="secondary" className="capitalize">
                    {accentColor}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Animations:</span>
                  <Badge variant="secondary">
                    {animations ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/theme-settings">
              <Button size="lg" className="gap-2">
                <Palette className="h-5 w-5" />
                Open Theme Settings
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2">
              <Eye className="h-5 w-5" />
              View Documentation
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Try the floating theme toggle in the bottom-right corner! →
          </p>
        </motion.div>

        {/* Demo Floating Toggle */}
        <FloatingThemeToggle position="bottom-left" />
      </div>
    </ThemeTransition>
  )
}
