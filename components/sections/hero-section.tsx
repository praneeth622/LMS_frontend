"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Play, ArrowRight, Users, BookOpen, Award, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const stats = [
  { icon: Users, value: "50K+", label: "Active Students", color: "text-blue-600" },
  { icon: BookOpen, value: "200+", label: "Expert Courses", color: "text-green-600" },
  { icon: Award, value: "95%", label: "Success Rate", color: "text-purple-600" },
  { icon: TrendingUp, value: "4.9/5", label: "Rating", color: "text-orange-600" },
]

const features = [
  "🎯 Personalized Learning Paths",
  "📱 Mobile-First Experience", 
  "🏆 Industry Certifications",
  "👥 Expert Instructors"
]

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-20 pb-32">
      {/* Enhanced Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-20 w-80 h-80 bg-primary/12 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent/12 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.4, 0.6] 
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-primary/8 to-accent/8 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        {/* Additional floating elements */}
        <motion.div 
          className="absolute top-32 right-32 w-24 h-24 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-32 left-32 w-32 h-32 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-xl"
          animate={{ 
            y: [0, 15, 0],
            x: [0, -10, 0] 
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center max-w-7xl mx-auto">
          
          {/* Announcement Badge with enhanced design */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Badge variant="secondary" className="px-8 py-4 text-base font-medium bg-primary/12 text-primary border-primary/25 hover:bg-primary/20 transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
              <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
              New: AI-Powered Learning Recommendations
            </Badge>
          </motion.div>

          {/* Main Heading with improved spacing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-16"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-foreground mb-12 leading-tight tracking-tight">
              Transform Your
              <span className="text-gradient block mt-6">Learning Journey</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-5xl mx-auto leading-relaxed">
              Master in-demand skills with our cutting-edge learning platform. 
              Join a community of learners and unlock your potential with expert-led courses.
            </p>
          </motion.div>

          {/* Feature Highlights with enhanced design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <div className="flex flex-wrap justify-center gap-8 text-lg text-muted-foreground max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <motion.span 
                  key={index} 
                  className="flex items-center gap-3 px-6 py-3 bg-background/60 backdrop-blur-sm rounded-full border border-border/60 hover:bg-background/80 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {feature}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons with enhanced spacing and design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-8 justify-center mb-24"
          >
            <Button size="lg" className="btn-primary text-xl px-12 py-6 shadow-learning hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1" asChild>
              <Link href="/register">
                Start Learning Now
                <ArrowRight className="ml-4 h-6 w-6" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="text-xl px-12 py-6 border-2 hover:bg-primary/8 hover:border-primary/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm" asChild>
              <Link href="/courses">
                <Play className="mr-4 h-6 w-6" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          {/* Stats Section with improved spacing */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-16 mt-28"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center group"
              >
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-3xl bg-white/90 dark:bg-gray-800/90 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 ${stat.color} backdrop-blur-sm`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-20 left-10 w-4 h-4 bg-primary/60 rounded-full"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-40 right-10 w-6 h-6 bg-accent/60 rounded-full"
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute bottom-40 left-20 w-3 h-3 bg-success/60 rounded-full"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}