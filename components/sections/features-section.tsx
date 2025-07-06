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
  Star
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with real-world experience and proven track records.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Interactive Learning",
    description: "Engage with peers and instructors through live sessions, discussions, and group projects.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Trophy,
    title: "Certifications",
    description: "Earn recognized certificates upon completion to boost your career prospects.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Learn at your own pace with 24/7 access to course materials and resources.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Shield,
    title: "Lifetime Access",
    description: "Get unlimited access to course content and updates for continuous learning.",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    icon: Zap,
    title: "Fast Track Learning",
    description: "Accelerated learning paths designed to help you achieve your goals quickly.",
    gradient: "from-yellow-500 to-orange-500"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Why Choose <span className="text-primary">EduFlow</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of online learning with our cutting-edge platform designed for modern learners.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground mb-6">Learning Benefits</h3>
            {[
              "Access to 200+ premium courses",
              "Interactive quizzes and assignments",
              "Progress tracking and analytics",
              "Mobile-friendly learning experience"
            ].map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground mb-6">Success Metrics</h3>
            {[
              "95% completion rate",
              "4.8/5 average rating",
              "50,000+ satisfied learners",
              "Industry-recognized certificates"
            ].map((metric, index) => (
              <motion.div
                key={metric}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-muted-foreground">{metric}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}