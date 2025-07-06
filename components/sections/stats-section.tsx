"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Users, BookOpen, Award, Globe } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: 50000,
    label: "Active Students",
    suffix: "+"
  },
  {
    icon: BookOpen,
    value: 200,
    label: "Expert Courses",
    suffix: "+"
  },
  {
    icon: Award,
    value: 95,
    label: "Success Rate",
    suffix: "%"
  },
  {
    icon: Globe,
    value: 120,
    label: "Countries",
    suffix: "+"
  }
]

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = (currentTime - startTime) / (duration * 1000)
      
      if (progress < 1) {
        setCount(Math.min(Math.floor(end * progress), end))
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration])
  
  return <span>{count.toLocaleString()}</span>
}

export function StatsSection() {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <section className="py-24 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onViewportEnter={() => setIsVisible(true)}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Trusted by Learners Worldwide
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Join a global community of learners and achieve your educational goals with confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/20 rounded-full mb-6">
                <stat.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {isVisible ? <CountUp end={stat.value} /> : 0}
                {stat.suffix}
              </div>
              <p className="text-lg text-primary-foreground/80">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center space-x-2">
              <Award className="h-6 w-6 text-yellow-400" />
              <span className="text-lg">Industry Recognition</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-blue-400" />
              <span className="text-lg">Global Reach</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-green-400" />
              <span className="text-lg">Expert Community</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}