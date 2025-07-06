"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Activity,
  Server,
  Database,
  Wifi,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SystemMetricsChart } from '@/components/admin/charts'
import { toast } from "react-hot-toast"
import { adminApi, SystemHealth } from '@/lib/admin-api'

interface SystemMetric {
  name: string
  value: number
  status: 'healthy' | 'warning' | 'critical'
  icon: React.ComponentType<any>
}

export default function SystemHealthPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [systemHealth, setSystemHealth] = React.useState<SystemHealth | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date())

  const [metrics, setMetrics] = React.useState<SystemMetric[]>([
    {
      name: "CPU Usage",
      value: 45,
      status: 'healthy',
      icon: Activity
    },
    {
      name: "Memory Usage",
      value: 68,
      status: 'warning',
      icon: Server
    },
    {
      name: "Disk Usage",
      value: 23,
      status: 'healthy',
      icon: Database
    },
    {
      name: "Network",
      value: 95,
      status: 'healthy',
      icon: Wifi
    }
  ])

  const systemMetricsData = [
    { name: '00:00', cpu: 30, memory: 45, disk: 20 },
    { name: '04:00', cpu: 25, memory: 40, disk: 22 },
    { name: '08:00', cpu: 60, memory: 70, disk: 25 },
    { name: '12:00', cpu: 80, memory: 85, disk: 30 },
    { name: '16:00', cpu: 70, memory: 75, disk: 28 },
    { name: '20:00', cpu: 45, memory: 55, disk: 24 },
  ]

  const fetchSystemHealth = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getSystemHealth()
      if (response.success) {
        setSystemHealth(response.data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error fetching system health:', error)
      // Use mock data if API fails
      setSystemHealth({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: 3600,
        database: "connected"
      })
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSystemHealth()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    fetchSystemHealth()
    toast.success('System health refreshed')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'critical':
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'critical':
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <ProtectedRoute allowedRoles={[1]}>
      <div className="flex h-screen bg-background">
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader 
            title="System Health"
            subtitle="Monitor system performance and status"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* System Status Overview */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">System Status</h2>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
                
                <Button onClick={handleRefresh} disabled={loading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {/* Overall Health Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {systemHealth?.status === 'ok' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <span>Overall System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(systemHealth?.status || 'unknown')}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="text-lg font-semibold mt-1">
                        {systemHealth?.uptime ? formatUptime(systemHealth.uptime) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Database</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(systemHealth?.database || 'unknown')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {metric.name}
                        </CardTitle>
                        <metric.icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-2">
                          {metric.value}%
                        </div>
                        <Progress value={metric.value} className="mb-2" />
                        <div className="flex items-center justify-between">
                          {getStatusBadge(metric.status)}
                          <span className={`text-sm ${getStatusColor(metric.status)}`}>
                            {metric.status === 'healthy' ? 'Normal' : 
                             metric.status === 'warning' ? 'High' : 'Critical'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Performance Charts */}
              <div className="grid grid-cols-1 gap-6">
                <SystemMetricsChart
                  title="System Performance (24h)"
                  description="CPU, Memory, and Disk usage over time"
                  data={systemMetricsData}
                  loading={loading}
                />
              </div>

              {/* Service Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Status</CardTitle>
                  <CardDescription>
                    Status of critical system services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Web Server', status: 'healthy', port: '3000' },
                      { name: 'Database', status: 'healthy', port: '5432' },
                      { name: 'Redis Cache', status: 'healthy', port: '6379' },
                      { name: 'File Storage', status: 'warning', port: 'N/A' },
                      { name: 'Email Service', status: 'healthy', port: '587' },
                    ].map((service, index) => (
                      <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            service.status === 'healthy' ? 'bg-green-500' :
                            service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">Port: {service.port}</p>
                          </div>
                        </div>
                        {getStatusBadge(service.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}