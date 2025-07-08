"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, 
  Search, 
  Filter, 
  Download,
  Eye,
  Calendar,
  User,
  Database,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Calendar as CalendarIcon
} from "lucide-react"
import { AdminHeader } from '@/components/admin/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { adminApiExtended, AuditLog } from '@/lib/admin-api-extended'
import { toast } from "react-hot-toast"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { DayPicker } from "react-day-picker"

export default function AdminAuditLogs() {
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedTable, setSelectedTable] = React.useState<string>("all")
  const [selectedAction, setSelectedAction] = React.useState<string>("all")
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [stats, setStats] = React.useState<any>(null)

  const itemsPerPage = 10

  const tableNames = [
    "users", "courses", "organizations", "enrollments", 
    "quizzes", "assignments", "discussions", "notifications"
  ]

  const actionTypes = [
    "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "VIEW"
  ]

  React.useEffect(() => {
    fetchAuditLogs()
    fetchAuditStats()
  }, [currentPage, selectedTable, selectedAction])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      if (selectedTable !== "all") filters.table = selectedTable
      if (selectedAction !== "all") filters.action = selectedAction

      const response = await adminApiExtended.getAuditLogs(currentPage, itemsPerPage, filters)
      if (response?.success && Array.isArray(response.data)) {
        setAuditLogs(response.data)
        if (response.meta) {
          setTotalPages(response.meta.totalPages)
        }
      } else {
        setAuditLogs([]) // Ensure auditLogs is always an array
        toast.error('Unexpected response format while fetching audit logs')
      }
    } catch (error) {
      setAuditLogs([]) // Ensure auditLogs is always an array
      toast.error('Failed to fetch audit logs')
    } finally {
      setLoading(false)
    }
  }

  const fetchAuditStats = async () => {
    try {
      const response = await adminApiExtended.getAuditStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch audit stats:', error)
    }
  }

  const handleExportLogs = () => {
    // In a real implementation, this would generate and download a CSV/Excel file
    toast.success('Audit logs export started. You will receive an email when ready.')
  }

  const openDetailsDialog = (log: AuditLog) => {
    setSelectedLog(log)
    setShowDetailsDialog(true)
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const getActionBadgeVariant = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE": return "default"
      case "UPDATE": return "secondary"
      case "DELETE": return "destructive"
      case "LOGIN": return "outline"
      case "LOGOUT": return "outline"
      case "VIEW": return "secondary"
      default: return "outline"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE": return <CheckCircle className="h-3 w-3" />
      case "UPDATE": return <AlertCircle className="h-3 w-3" />
      case "DELETE": return <XCircle className="h-3 w-3" />
      case "LOGIN": return <User className="h-3 w-3" />
      case "LOGOUT": return <User className="h-3 w-3" />
      case "VIEW": return <Eye className="h-3 w-3" />
      default: return <Activity className="h-3 w-3" />
    }
  }

  const getTableIcon = (tableName: string) => {
    switch (tableName.toLowerCase()) {
      case "users": return <User className="h-4 w-4" />
      case "courses": return <FileText className="h-4 w-4" />
      case "organizations": return <Database className="h-4 w-4" />
      default: return <Database className="h-4 w-4" />
    }
  }

  return (
    <>
      <AdminHeader 
        title="Audit Logs"
        subtitle="Track all system activities and changes"
        action={
          <div className="flex gap-2">
            <Button onClick={fetchAuditLogs} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleExportLogs} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                    <p className="text-2xl font-bold">{stats?.total || auditLogs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Today's Activities</p>
                    <p className="text-2xl font-bold">{stats?.today || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{stats?.activeUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Critical Actions</p>
                    <p className="text-2xl font-bold">
                      {auditLogs.filter(log => log.action_type === 'DELETE').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Audit Logs</CardTitle>
                  <CardDescription>
                    Complete history of all system activities
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Filter by table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tables</SelectItem>
                    {tableNames.map((table) => (
                      <SelectItem key={table} value={table}>
                        {table.charAt(0).toUpperCase() + table.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {actionTypes.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Audit Logs Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Record ID</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell colSpan={7}>
                              <div className="flex items-center space-x-4">
                                <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                                <div className="space-y-2">
                                  <div className="w-32 h-4 bg-muted rounded animate-pulse" />
                                  <div className="w-48 h-3 bg-muted rounded animate-pulse" />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        filteredLogs.map((log) => (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group"
                          >
                            <TableCell>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">
                                    {format(new Date(log.timestamp), 'MMM dd, yyyy')}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {format(new Date(log.timestamp), 'HH:mm:ss')}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${log.user?.name || 'Unknown'}`} />
                                  <AvatarFallback className="text-xs">
                                    {log.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{log.user?.name || 'Unknown User'}</p>
                                  <p className="text-xs text-muted-foreground">ID: {log.user_id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getActionBadgeVariant(log.action_type)} className="flex items-center gap-1 w-fit">
                                {getActionIcon(log.action_type)}
                                {log.action_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getTableIcon(log.table_name)}
                                <span className="font-medium">{log.table_name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="px-2 py-1 bg-muted rounded text-sm">
                                {log.record_id}
                              </code>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="text-sm truncate">
                                  {log.action_details?.url || 'No details available'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Method: {log.action_details?.method || 'N/A'}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => openDetailsDialog(log)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <User className="h-4 w-4 mr-2" />
                                    View User Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Log
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Log Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this audit log entry
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Timestamp</Label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedLog.timestamp), 'PPpp')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedLog.user?.name || 'Unknown User'} (ID: {selectedLog.user_id})
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Action Type</Label>
                  <Badge variant={getActionBadgeVariant(selectedLog.action_type)} className="mt-1">
                    {selectedLog.action_type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Table Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedLog.table_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Record ID</Label>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {selectedLog.record_id}
                  </code>
                </div>
                <div>
                  <Label className="text-sm font-medium">Log ID</Label>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {selectedLog.id}
                  </code>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Action Details</Label>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.action_details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}