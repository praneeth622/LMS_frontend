"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
  Zap
} from "lucide-react"
import { AdminHeader } from '@/components/admin/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import { adminApiExtended } from '@/lib/admin-api-extended'
import { toast } from "react-hot-toast"

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: number
  responseTime: number
}

interface ServiceStatus {
  name: string
  status: 'healthy' | 'warning' | 'error'
  responseTime: number
  lastCheck: string
}

export default function AdminHealth() {
  const [loading, setLoading] = React.useState(true)
  const [systemHealth, setSystemHealth] = React.useState<any>(null)
  const [databaseHealth, setDatabaseHealth] = React.useState<any>(null)
  const [systemMetrics, setSystemMetrics] = React.useState<SystemMetrics>({
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 89,
    uptime: 99.9,
    responseTime: 120
  })
  const [services, setServices] = React.useState<ServiceStatus[]>([
    { name: "API Server", status: "healthy", responseTime: 45, lastCheck: new Date().toISOString() },
    { name: "Database", status: "healthy", responseTime: 12, lastCheck: new Date().toISOString() },
    { name: "File Storage", status: "warning", responseTime: 234, lastCheck: new Date().toISOString() },
    { name: "Email Service", status: "healthy", responseTime: 89, lastCheck: new Date().toISOString() },
    { name: "Cache Redis", status: "healthy", responseTime: 3, lastCheck: new Date().toISOString() },
    { name: "CDN", status: "error", responseTime: 0, lastCheck: new Date().toISOString() }
  ])

  // Mock performance data
  const [performanceData] = React.useState([
    { time: '00:00', cpu: 30, memory: 45, disk: 20, network: 60 },
    { time: '04:00', cpu: 25, memory: 40, disk: 22, network: 45 },
    { time: '08:00', cpu: 60, memory: 70, disk: 25, network: 80 },
    { time: '12:00', cpu: 80, memory: 85, disk: 30, network: 95 },
    { time: '16:00', cpu: 70, memory: 75, disk: 28, network: 85 },
    { time: '20:00', cpu: 45, memory: 55, disk: 24, network: 70 },
  ])

  const [responseTimeData] = React.useState([
    { time: '00:00', api: 120, db: 15, storage: 200 },
    { time: '04:00', api: 110, db: 12, storage: 180 },
    { time: '08:00', api: 150, db: 18, storage: 250 },
    { time: '12:00', api: 180, db: 25, storage: 300 },
    { time: '16:00', api: 160, db: 20, storage: 280 },
    { time: '20:00', api: 130, db: 16, storage: 220 },
  ])

  React.useEffect(() => {
    fetchHealthData()
    // Set up real-time updates
    const interval = setInterval(fetchHealthData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchHealthData = async () => {
    try {
      setLoading(true)
      
      // Fetch system health
      const healthResponse = await adminApiExtended.getSystemHealth()
      if (healthResponse.success) {
        setSystemHealth(healthResponse.data)
      }

      // Fetch database health
      const dbResponse = await adminApiExtended.getDatabaseHealth()
      if (dbResponse.success) {
        setDatabaseHealth(dbResponse.data)
      }

      // Simulate real-time metrics updates
      setSystemMetrics(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(10, Math.min(80, prev.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        responseTime: Math.max(50, Math.min(500, prev.responseTime + (Math.random() - 0.5) * 50))
      }))

    } catch (error) {
      console.error('Failed to fetch health data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'error': return <XCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getMetricColor = (value: number, type: string) => {
    if (type === 'uptime') {
      if (value >= 99) return 'text-green-600'
      if (value >= 95) return 'text-yellow-600'
      return 'text-red-600'
    }
    
    if (value >= 80) return 'text-red-600'
    if (value >= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatUptime = (hours: number) => {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days}d ${remainingHours}h`
  }

  return (
    <>
      <AdminHeader 
        title="System Health"
        subtitle="Monitor system performance and service status"
        action={
          <Button onClick={fetchHealthData} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">System Status</p>
                      <p className="text-2xl font-bold text-green-600">Healthy</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                      <p className={`text-2xl font-bold ${getMetricColor(systemMetrics.uptime, 'uptime')}`}>
                        {systemMetrics.uptime.toFixed(1)}%
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                      <p className="text-2xl font-bold">{systemMetrics.responseTime.toFixed(0)}ms</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                      <p className="text-2xl font-bold">
                        {services.filter(s => s.status === 'healthy').length}/{services.length}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Server className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Resource Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Resource Usage
                  </CardTitle>
                  <CardDescription>
                    Current system resource utilization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">CPU Usage</span>
                      </div>
                      <span className={`text-sm font-medium ${getMetricColor(systemMetrics.cpu, 'cpu')}`}>
                        {systemMetrics.cpu.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.cpu} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MemoryStick className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Memory Usage</span>
                      </div>
                      <span className={`text-sm font-medium ${getMetricColor(systemMetrics.memory, 'memory')}`}>
                        {systemMetrics.memory.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.memory} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Disk Usage</span>
                      </div>
                      <span className={`text-sm font-medium ${getMetricColor(systemMetrics.disk, 'disk')}`}>
                        {systemMetrics.disk.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.disk} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Network I/O</span>
                      </div>
                      <span className={`text-sm font-medium ${getMetricColor(systemMetrics.network, 'network')}`}>
                        {systemMetrics.network.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={systemMetrics.network} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Service Status
                  </CardTitle>
                  <CardDescription>
                    Status of all system services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {services.map((service, index) => (
                      <motion.div
                        key={service.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(service.status)}>
                            {getStatusIcon(service.status)}
                          </Badge>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Response: {service.responseTime}ms
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium capitalize">{service.status}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(service.lastCheck).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>System Performance (24h)</CardTitle>
                  <CardDescription>
                    Resource usage over the last 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="cpu" 
                          stackId="1" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="memory" 
                          stackId="1" 
                          stroke="#10b981" 
                          fill="#10b981" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="disk" 
                          stackId="1" 
                          stroke="#8b5cf6" 
                          fill="#8b5cf6" 
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Response Times (24h)</CardTitle>
                  <CardDescription>
                    Service response times over the last 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={responseTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="api" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="API Server"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="db" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Database"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="storage" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          name="File Storage"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Database Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Health
                </CardTitle>
                <CardDescription>
                  Database connection and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Connection Status</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">Connected</p>
                    <p className="text-sm text-muted-foreground">
                      {databaseHealth?.status || 'Healthy'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Active Connections</span>
                    </div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-muted-foreground">
                      Max: 100 connections
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Query Performance</span>
                    </div>
                    <p className="text-2xl font-bold">12ms</p>
                    <p className="text-sm text-muted-foreground">
                      Average response time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="flex gap-4 justify-end"
          >
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Health Check
            </Button>
          </motion.div>
        </div>
      </main>
    </>
  )
}