"use client"

import { useMemo } from 'react'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle } from 'lucide-react'

interface PasswordStrengthProps {
  password: string
}

interface PasswordCriteria {
  label: string
  test: (password: string) => boolean
}

const criteria: PasswordCriteria[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { strength, score, passedCriteria } = useMemo(() => {
    const passed = criteria.filter(c => c.test(password))
    const score = (passed.length / criteria.length) * 100
    
    let strength = 'Very Weak'
    if (score >= 80) strength = 'Strong'
    else if (score >= 60) strength = 'Good'
    else if (score >= 40) strength = 'Fair'
    else if (score >= 20) strength = 'Weak'
    
    return { strength, score, passedCriteria: passed.length }
  }, [password])

  const getStrengthColor = () => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-info'
    if (score >= 40) return 'text-warning'
    if (score >= 20) return 'text-caution'
    return 'text-error'
  }

  const getProgressColor = () => {
    if (score >= 80) return 'bg-green-600'
    if (score >= 60) return 'bg-blue-600'
    if (score >= 40) return 'bg-yellow-600'
    if (score >= 20) return 'bg-orange-600'
    return 'bg-red-600'
  }

  if (!password) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password Strength:</span>
        <span className={`text-sm font-medium ${getStrengthColor()}`}>
          {strength}
        </span>
      </div>
      
      <Progress value={score} className="h-2">
        <div 
          className={`h-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${score}%` }}
        />
      </Progress>
      
      <div className="space-y-1">
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            {criterion.test(password) ? (
              <CheckCircle className="h-3 w-3 text-green-600" />
            ) : (
              <XCircle className="h-3 w-3 text-red-400" />
            )}
            <span className={criterion.test(password) ? 'text-green-600' : 'text-muted-foreground'}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}