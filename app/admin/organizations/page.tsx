"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Building2, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  UserPlus,
  UserMinus,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  TrendingUp
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { adminApiExtended, Organization, User } from '@/lib/admin-api-extended'
import { toast } from "react-hot-toast"
import { format } from "date-fns"

export default function AdminOrganizations() {
  const [organizations, setOrganizations] = React.useState<Organization[]>([])
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedType, setSelectedType] = React.useState<string>("all")
  const [selectedOrganizations, setSelectedOrganizations] = React.useState<number[]>([])
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [showEditDialog, setShowEditDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showUsersDialog, setShowUsersDialog] = React.useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = React.useState(false)
  const [selectedOrganization, setSelectedOrganization] = React.useState<Organization | null>(null)
  const [organizationUsers, setOrganizationUsers] = React.useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = React.useState<string>("")
  const [formData, setFormData] = React.useState({
    name: "",
    type: "",
    description: "",
    website: "",
    phone: "",
    email: "",
    address: ""
  })

  const organizationTypes = [
    "University", "School", "Corporate", "Training Center", 
    "Government", "Non-Profit", "Healthcare", "Technology"
  ]

  React.useEffect(() => {
    fetchOrganizations()
    fetchUsers()
  }, [])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const response = await adminApiExtended.getAllOrganizations()
      if (response.success) {
        setOrganizations(response.data)
      }
    } catch (error) {
      toast.error('Failed to fetch organizations')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await adminApiExtended.getAllUsers()
      if (response.success) {
        setUsers(response.data.filter(user => !user.is_deleted))
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchOrganizationUsers = async (orgId: number) => {
    try {
      const response = await adminApiExtended.getOrganizationUsers(orgId)
      if (response.success) {
        setOrganizationUsers(response.data)
      }
    } catch (error) {
      toast.error('Failed to fetch organization users')
    }
  }

  const handleCreateOrganization = async () => {
    try {
      const response = await adminApiExtended.createOrganization({
        name: formData.name,
        type: formData.type
      })
      if (response.success) {
        toast.success('Organization created successfully')
        setShowCreateDialog(false)
        setFormData({
          name: "",
          type: "",
          description: "",
          website: "",
          phone: "",
          email: "",
          address: ""
        })
        fetchOrganizations()
      }
    } catch (error) {
      toast.error('Failed to create organization')
    }
  }

  const handleUpdateOrganization = async () => {
    if (!selectedOrganization) return
    
    try {
      const response = await adminApiExtended.updateOrganization(selectedOrganization.id, {
        name: formData.name,
        type: formData.type
      })
      if (response.success) {
        toast.success('Organization updated successfully')
        setShowEditDialog(false)
        setSelectedOrganization(null)
        fetchOrganizations()
      }
    } catch (error) {
      toast.error('Failed to update organization')
    }
  }

  const handleDeleteOrganization = async () => {
    if (!selectedOrganization) return
    
    try {
      const response = await adminApiExtended.deleteOrganization(selectedOrganization.id)
      if (response.success) {
        toast.success('Organization deleted successfully')
        setShowDeleteDialog(false)
        setSelectedOrganization(null)
        fetchOrganizations()
      }
    } catch (error) {
      toast.error('Failed to delete organization')
    }
  }

  const handleAddUserToOrganization = async () => {
    if (!selectedOrganization || !selectedUserId) return
    
    try {
      const response = await adminApiExtended.addUserToOrganization(
        selectedOrganization.id, 
        parseInt(selectedUserId)
      )
      if (response.success) {
        toast.success('User added to organization successfully')
        setShowAddUserDialog(false)
        setSelectedUserId("")
        fetchOrganizationUsers(selectedOrganization.id)
      }
    } catch (error) {
      toast.error('Failed to add user to organization')
    }
  }

  const handleRemoveUserFromOrganization = async (userId: number) => {
    if (!selectedOrganization) return
    
    try {
      const response = await adminApiExtended.removeUserFromOrganization(
        selectedOrganization.id, 
        userId
      )
      if (response.success) {
        toast.success('User removed from organization successfully')
        fetchOrganizationUsers(selectedOrganization.id)
      }
    } catch (error) {
      toast.error('Failed to remove user from organization')
    }
  }

  const openEditDialog = (organization: Organization) => {
    setSelectedOrganization(organization)
    setFormData({
      name: organization.name,
      type: organization.type,
      description: "",
      website: "",
      phone: "",
      email: "",
      address: ""
    })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (organization: Organization) => {
    setSelectedOrganization(organization)
    setShowDeleteDialog(true)
  }

  const openUsersDialog = async (organization: Organization) => {
    setSelectedOrganization(organization)
    setShowUsersDialog(true)
    await fetchOrganizationUsers(organization.id)
  }

  const openAddUserDialog = (organization: Organization) => {
    setSelectedOrganization(organization)
    setShowAddUserDialog(true)
  }

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || org.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "University": "bg-blue-100 text-blue-800",
      "School": "bg-green-100 text-green-800",
      "Corporate": "bg-purple-100 text-purple-800",
      "Training Center": "bg-orange-100 text-orange-800",
      "Government": "bg-red-100 text-red-800",
      "Non-Profit": "bg-yellow-100 text-yellow-800",
      "Healthcare": "bg-pink-100 text-pink-800",
      "Technology": "bg-indigo-100 text-indigo-800"
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const handleSelectOrganization = (orgId: number) => {
    setSelectedOrganizations(prev => 
      prev.includes(orgId) 
        ? prev.filter(id => id !== orgId)
        : [...prev, orgId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrganizations.length === filteredOrganizations.length) {
      setSelectedOrganizations([])
    } else {
      setSelectedOrganizations(filteredOrganizations.map(org => org.id))
    }
  }

  const availableUsers = users.filter(user => 
    !organizationUsers.some(orgUser => orgUser.id === user.id)
  )

  return (
    <>
      <AdminHeader 
        title="Organization Management"
        subtitle="Manage organizations and their members"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
                    <p className="text-2xl font-bold">{organizations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                    <p className="text-2xl font-bold">
                      {organizations.reduce((sum, org) => sum + (org.users?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Universities</p>
                    <p className="text-2xl font-bold">
                      {organizations.filter(org => org.type === 'University').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Corporate</p>
                    <p className="text-2xl font-bold">
                      {organizations.filter(org => org.type === 'Corporate').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Organizations</CardTitle>
                  <CardDescription>
                    Manage all organizations and their members
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Organization
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Organization</DialogTitle>
                        <DialogDescription>
                          Add a new organization to the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Organization Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter organization name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                            <SelectContent>
                              {organizationTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter organization description"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              value={formData.website}
                              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="https://example.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="contact@organization.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Enter organization address"
                            rows={2}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateOrganization}>
                          Create Organization
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {organizationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Organizations Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedOrganizations.length === filteredOrganizations.length && filteredOrganizations.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell colSpan={6}>
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-muted rounded animate-pulse" />
                                <div className="space-y-2">
                                  <div className="w-48 h-4 bg-muted rounded animate-pulse" />
                                  <div className="w-32 h-3 bg-muted rounded animate-pulse" />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        filteredOrganizations.map((organization) => (
                          <motion.tr
                            key={organization.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group"
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedOrganizations.includes(organization.id)}
                                onCheckedChange={() => handleSelectOrganization(organization.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                  <Building2 className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">{organization.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    ID: {organization.id}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getTypeColor(organization.type)}>
                                {organization.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                {organization.users?.length || 0} members
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-1" />
                                {organization.created_at 
                                  ? format(new Date(organization.created_at), 'MMM dd, yyyy')
                                  : 'N/A'
                                }
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
                                  <DropdownMenuItem onClick={() => openEditDialog(organization)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openUsersDialog(organization)}>
                                    <Users className="h-4 w-4 mr-2" />
                                    View Members
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openAddUserDialog(organization)}>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Add Member
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => openDeleteDialog(organization)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
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
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Edit Organization Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update organization information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Organization Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrganization}>
              Update Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Members Dialog */}
      <Dialog open={showUsersDialog} onOpenChange={setShowUsersDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Organization Members</DialogTitle>
            <DialogDescription>
              Members of {selectedOrganization?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {organizationUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No members found in this organization
              </div>
            ) : (
              <div className="space-y-2">
                {organizationUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveUserFromOrganization(user.id)}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUsersDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Add a user to {selectedOrganization?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-select">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user to add" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUserToOrganization} disabled={!selectedUserId}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Organization Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the organization
              "{selectedOrganization?.name}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrganization} className="bg-destructive text-destructive-foreground">
              Delete Organization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}