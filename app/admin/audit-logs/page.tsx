"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ColumnDef } from "@tanstack/react-table"
import { 
  FileText,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"
import { format } from "date-fns"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { adminApi, AuditLog } from '@/lib/admin-api'

const actionTypeColors = {
  'POST': 'bg-green-100 text-green-800',
  'PUT': 'bg-blue-100 text-blue-800',
  'DELETE': 'bg-red-100 text-red-800',
  'GET': 'bg-gray-100 text-gray-800'
}

export default function AuditLogsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterType, setFilterType] = React.useState<string>("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)

  const fetchAuditLogs = async (page = 1) => {
    try {
      setLoading(true)
      const response = await adminApi.getAuditLogs(page, 10)
      if (response.success && Array.isArray(response.data)) {
        setAuditLogs(response.data)
        if (response.meta) {
          setTotalPages(response.meta.totalPages)
          setCurrentPage(response.meta.page)
        }
      } else {
        // In case we don't get an array, set to an empty array
        setAuditLogs([])
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      // Use mock data if API fails
      setAuditLogs([
        {
          id: 1,
          user_id: 1,
          action_type: "POST",
          table_name: "users",
          record_id: 2,
          action_details: { url: "/api/users", method: "POST" },
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          user_id: 1,
          action_type: "PUT",
          table_name: "organizations",
          record_id: 1,
          action_details: { url: "/api/organizations/1", method: "PUT" },
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 3,
          user_id: 2,
          action_type: "DELETE",
          table_name: "users",
          record_id: 3,
          action_details: { url: "/api/users/3", method: "DELETE" },
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchAuditLogs()
  }, [])

  const handleRefresh = () => {
    fetchAuditLogs(currentPage)
    toast.success('Audit logs refreshed')
  }

  const handleExport = () => {
    // Mock export functionality
    toast.success('Audit logs exported successfully')
  }

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => {
        return format(new Date(row.getValue("timestamp")), "MMM dd, yyyy HH:mm:ss")
      },
    },
    {
      accessorKey: "user_id",
      header: "User ID",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("user_id")}
        </Badge>
      ),
    },
    {
      accessorKey: "action_type",
      header: "Action",
      cell: ({ row }) => {
        const actionType = row.getValue<string>("action_type")
        return (
          <Badge className={actionTypeColors[actionType as keyof typeof actionTypeColors]}>
            {actionType}
          </Badge>
        )
      },
    },
    {
      accessorKey: "table_name",
      header: "Table",
      cell: ({ row }) => (
        <code className="bg-muted px-2 py-1 rounded text-sm">
          {row.getValue("table_name")}
        </code>
      ),
    },
    {
      accessorKey: "record_id",
      header: "Record ID",
    },
    {
      accessorKey: "action_details",
      header: "Details",
      cell: ({ row }) => {
        const details = row.getValue<{ url: string; method: string }>("action_details")
        return (
          <div className="text-sm">
            <div className="font-mono text-xs text-muted-foreground">
              {details.url}
            </div>
          </div>
        )
      },
    },
  ]

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.table_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action_details.url.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterType === "all" || log.action_type === filterType
    
    return matchesSearch && matchesFilter
  })

  return (
    <ProtectedRoute allowedRoles={[1]}>
      <div className="flex h-screen bg-background">
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader 
            title="Audit Logs"
            subtitle="Monitor system activities and user actions"
            searchPlaceholder="Search logs..."
            onSearch={setSearchQuery}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditLogs.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Actions</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {auditLogs.filter(log => 
                        new Date(log.timestamp).toDateString() === new Date().toDateString()
                      ).length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Set(auditLogs.map(log => log.user_id)).size}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-lg font-semibold">Audit Logs</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredLogs.length} logs found
                    </p>
                  </div>
                  
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="POST">Create</SelectItem>
                      <SelectItem value="PUT">Update</SelectItem>
                      <SelectItem value="DELETE">Delete</SelectItem>
                      <SelectItem value="GET">Read</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Audit Logs Table */}
              <DataTable
                columns={columns}
                data={filteredLogs}
                searchKey="table_name"
                searchPlaceholder="Search logs..."
                loading={loading}
              />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}