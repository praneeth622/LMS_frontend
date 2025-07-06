"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QuizTimerProps {
  timeLimit: number // in seconds
  onTimeUp: () => void
  isActive: boolean
}

export function QuizTimer({ timeLimit, onTimeUp, isActive }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState(timeLimit)
  const [isWarning, setIsWarning] = React.useState(false)

  React.useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        
        // Show warning when 5 minutes or 10% of time left (whichever is smaller)
        const warningThreshold = Math.min(300, timeLimit * 0.1)
        if (prev <= warningThreshold && !isWarning) {
          setIsWarning(true)
        }
        
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeUp, timeLimit, isWarning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    return ((timeLimit - timeLeft) / timeLimit) * 100
  }

  const getTimerColor = () => {
    if (timeLeft <= 60) return "text-red-600"
    if (isWarning) return "text-yellow-600"
    return "text-foreground"
  }

  const getProgressColor = () => {
    if (timeLeft <= 60) return "bg-red-500"
    if (isWarning) return "bg-yellow-500"
    return "bg-primary"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <Card className={`border-2 ${isWarning ? 'border-yellow-500' : timeLeft <= 60 ? 'border-red-500' : 'border-border'}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Clock className={`h-5 w-5 ${getTimerColor()}`} />
              {isWarning && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                </motion.div>
              )}
            </div>
            
            <div>
              <div className={`text-lg font-mono font-bold ${getTimerColor()}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${getProgressColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            {isWarning && (
              <Badge variant="destructive" className="text-xs">
                Warning
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}