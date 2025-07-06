"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  Building2
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
import { adminApi, Organization } from '@/lib/admin-api'

const organizationTypes = {
  'educational_institute': 'Educational Institute',
  'corporate': 'Corporate',
  'government': 'Government',
  'non_profit': 'Non-Profit'
}

const typeColors = {
  'educational_institute': 'bg-blue-100 text-blue-800',
  'corporate': 'bg-green-100 text-green-800',
  'government': 'bg-purple-100 text-purple-800',
  'non_profit': 'bg-orange-100 text-orange-800'
}

export default function OrganizationsManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [organizations, setOrganizations] = React.useState<Organization[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [selectedOrg, setSelectedOrg] = React.useState<Organization | null>(null)
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'educational_institute'
  })

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getAllOrganizations()
      if (response.success) {
        setOrganizations(response.data)
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      // Use mock data if API fails
      setOrganizations([
        {
          id: 1,
          name: "Tech University",
          type: "educational_institute",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: "Innovation Corp",
          type: "corporate",
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchOrganizations()
  }, [])

  const handleCreateOrganization = async () => {
    try {
      const response = await adminApi.createOrganization({
        name: formData.name,
        type: formData.type
      })
      
      if (response.success) {
        toast.success('Organization created successfully')
        setIsCreateDialogOpen(false)
        setFormData({ name: '', type: 'educational_institute' })
        fetchOrganizations()
      }
    } catch (error) {
      console.error('Error creating organization:', error)
      toast.error('Failed to create organization')
    }
  }

  const handleEditOrganization = async () => {
    if (!selectedOrg) return
    
    try {
      const response = await adminApi.updateOrganization(selectedOrg.id, {
        name: formData.name,
        type: formData.type
      })
      
      if (response.success) {
        toast.success('Organization updated successfully')
        setIsEditDialogOpen(false)
        setSelectedOrg(null)
        setFormData({ name: '', type: 'educational_institute' })
        fetchOrganizations()
      }
    } catch (error) {
      console.error('Error updating organization:', error)
      toast.error('Failed to update organization')
    }
  }

  const handleDeleteOrganization = async (orgId: number) => {
    try {
      await adminApi.deleteOrganization(orgId)
      toast.success('Organization deleted successfully')
      fetchOrganizations()
    } catch (error) {
      console.error('Error deleting organization:', error)
      toast.error('Failed to delete organization')
    }
  }

  const openEditDialog = (org: Organization) => {
    setSelectedOrg(org)
    setFormData({
      name: org.name,
      type: org.type
    })
    setIsEditDialogOpen(true)
  }

  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: "name",
      header: "Organization",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue<string>("type")
        return (
          <Badge className={typeColors[type as keyof typeof typeColors]}>
            {organizationTypes[type as keyof typeof organizationTypes]}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue<string>("created_at")
        return date ? format(new Date(date), "MMM dd, yyyy") : "N/A"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const org = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(org.name)}>
                Copy name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEditDialog(org)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit organization
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteOrganization(org.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.type.toLowerCase().includes(searchQuery.toLowerCase())
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
            title="Organization Management"
            subtitle="Manage organizations and their settings"
            searchPlaceholder="Search organizations..."
            onSearch={setSearchQuery}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Actions Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">All Organizations</h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredOrganizations.length} organizations found
                  </p>
                </div>
                
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Organization
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Organization</DialogTitle>
                      <DialogDescription>
                        Add a new organization to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Organization Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter organization name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select 
                          value={formData.type} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="educational_institute">Educational Institute</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="non_profit">Non-Profit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateOrganization}>Create Organization</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Organizations Table */}
              <DataTable
                columns={columns}
                data={filteredOrganizations}
                searchKey="name"
                searchPlaceholder="Search organizations..."
                loading={loading}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Edit Organization Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update organization information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Organization Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter organization name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="educational_institute">Educational Institute</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="non_profit">Non-Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditOrganization}>Update Organization</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}