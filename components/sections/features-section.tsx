"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Clock, 
  Shield, 
  Zap,
  CheckCircle,
  Star,
  Brain,
  Smartphone,
  Globe,
  Target
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Personalized learning paths and recommendations based on your progress and goals.",
    gradient: "from-purple-500 to-pink-500",
    highlight: "Smart",
    stats: "98% accuracy"
  },
  {
    icon: Users,
    title: "Interactive Community",
    description: "Connect with learners worldwide through live sessions, study groups, and forums.",
    gradient: "from-blue-500 to-cyan-500",
    highlight: "Global",
    stats: "50K+ students"
  },
  {
    icon: Trophy,
    title: "Industry Certifications",
    description: "Earn recognized certificates from top companies and institutions.",
    gradient: "from-orange-500 to-red-500",
    highlight: "Verified",
    stats: "200+ partners"
  },
  {
    icon: Clock,
    title: "Learn at Your Pace",
    description: "Flexible scheduling with offline access and mobile-first design.",
    gradient: "from-green-500 to-emerald-500",
    highlight: "24/7",
    stats: "Anytime access"
  },
  {
    icon: Smartphone,
    title: "Mobile Learning",
    description: "Seamless experience across all devices with offline content download.",
    gradient: "from-indigo-500 to-purple-500",
    highlight: "Mobile",
    stats: "iOS & Android"
  },
  {
    icon: Target,
    title: "Goal-Oriented Tracks",
    description: "Structured learning paths designed to achieve specific career outcomes.",
    gradient: "from-pink-500 to-rose-500",
    highlight: "Focused",
    stats: "95% success rate"
  }
]

const stats = [
  { value: "50K+", label: "Students Enrolled", icon: Users },
  { value: "200+", label: "Expert Courses", icon: BookOpen },
  { value: "95%", label: "Completion Rate", icon: CheckCircle },
  { value: "4.9/5", label: "Average Rating", icon: Star }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-primary/10 text-primary">
            Why Choose EduFlow
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Features that
            <span className="text-gradient block">Accelerate Learning</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience next-generation online education with cutting-edge technology, 
            expert instructors, and a global community of learners.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300">
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="card-interactive h-full group relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs font-medium border-primary/20 text-primary">
                      {feature.highlight}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative">
                  <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-medium">
                      {feature.stats}
                    </span>
                    <motion.div 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 5 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Skills?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who have already started their journey to success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-8 py-4 text-lg font-medium"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-8 py-4 text-lg font-medium"
              >
                View All Courses
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}