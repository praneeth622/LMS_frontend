"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX
} from "lucide-react"
import { format } from "date-fns"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { DataTable } from '@/components/admin/data-table'
import { Button } from "@/components/ui/button"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"
import { adminApi, User } from '@/lib/admin-api'

const roleNames = {
  1: 'Admin',
  2: 'Instructor', 
  3: 'Student'
}

const roleColors = {
  1: 'bg-red-100 text-red-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-green-100 text-green-800'
}

export default function UsersManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    role_id: 3
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAllUsers()
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async () => {
    try {
      const response = await adminApi.createUser({
        name: formData.name,
        email: formData.email,
        role_id: formData.role_id
      })
      
      if (response.success) {
        toast.success('User created successfully')
        setIsCreateDialogOpen(false)
        setFormData({ name: '', email: '', role_id: 3 })
        fetchUsers()
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user')
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return
    
    try {
      const response = await adminApi.updateUser(selectedUser.id, {
        name: formData.name,
        email: formData.email,
        role_id: formData.role_id
      })
      
      if (response.success) {
        toast.success('User updated successfully')
        setIsEditDialogOpen(false)
        setSelectedUser(null)
        setFormData({ name: '', email: '', role_id: 3 })
        fetchUsers()
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await adminApi.deleteUser(userId)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role_id: user.role_id
    })
    setIsEditDialogOpen(true)
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {row.getValue<string>("name").charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role_id",
      header: "Role",
      cell: ({ row }) => {
        const roleId = row.getValue<number>("role_id")
        return (
          <Badge className={roleColors[roleId as keyof typeof roleColors]}>
            {roleNames[roleId as keyof typeof roleNames]}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "MMM dd, yyyy")
      },
    },
    {
      accessorKey: "is_deleted",
      header: "Status",
      cell: ({ row }) => {
        const isDeleted = row.getValue<boolean>("is_deleted")
        return (
          <Badge variant={isDeleted ? "destructive" : "default"}>
            {isDeleted ? "Inactive" : "Active"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                Copy email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit user
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteUser(user.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={[1]}>
      <div className="flex h-screen bg-background">
        <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader 
            title="User Management"
            subtitle="Manage users, roles, and permissions"
            searchPlaceholder="Search users..."
            onSearch={setSearchQuery}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Actions Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">All Users</h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredUsers.length} users found
                  </p>
                </div>
                
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new user to the system. They will receive an email invitation.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={formData.role_id.toString()} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, role_id: parseInt(value) }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Admin</SelectItem>
                            <SelectItem value="2">Instructor</SelectItem>
                            <SelectItem value="3">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser}>Create User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Users Table */}
              <DataTable
                columns={columns}
                data={filteredUsers}
                searchKey="name"
                searchPlaceholder="Search users..."
                loading={loading}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select 
                value={formData.role_id.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role_id: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">Instructor</SelectItem>
                  <SelectItem value="3">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}