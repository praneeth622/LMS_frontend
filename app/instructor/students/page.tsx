"use client";

import { useState, useEffect } from "react";
import { InstructorHeader } from "@/components/instructor/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Download, Mail, MoreVertical, Eye, UserX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  course: string;
  enrollmentDate: Date;
  status: "active" | "inactive" | "suspended";
  progress: number;
  grade: string;
  lastActive: Date;
  totalAssignments: number;
  completedAssignments: number;
  avgScore: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Mock data for students
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "Alice Johnson",
        email: "alice.johnson@email.com",
        course: "Web Development Fundamentals",
        enrollmentDate: new Date("2024-01-15"),
        status: "active",
        progress: 85,
        grade: "A",
        lastActive: new Date("2024-01-25"),
        totalAssignments: 12,
        completedAssignments: 10,
        avgScore: 88
      },
      {
        id: "2",
        name: "Bob Smith",
        email: "bob.smith@email.com",
        course: "Web Development Fundamentals",
        enrollmentDate: new Date("2024-01-10"),
        status: "active",
        progress: 72,
        grade: "B+",
        lastActive: new Date("2024-01-24"),
        totalAssignments: 12,
        completedAssignments: 9,
        avgScore: 75
      },
      {
        id: "3",
        name: "Carol Davis",
        email: "carol.davis@email.com",
        course: "Frontend Mastery",
        enrollmentDate: new Date("2024-01-05"),
        status: "active",
        progress: 95,
        grade: "A+",
        lastActive: new Date("2024-01-25"),
        totalAssignments: 15,
        completedAssignments: 14,
        avgScore: 92
      },
      {
        id: "4",
        name: "David Wilson",
        email: "david.wilson@email.com",
        course: "Frontend Mastery",
        enrollmentDate: new Date("2024-01-12"),
        status: "inactive",
        progress: 45,
        grade: "C",
        lastActive: new Date("2024-01-20"),
        totalAssignments: 15,
        completedAssignments: 7,
        avgScore: 68
      },
      {
        id: "5",
        name: "Eva Brown",
        email: "eva.brown@email.com",
        course: "Backend Development",
        enrollmentDate: new Date("2024-01-08"),
        status: "active",
        progress: 78,
        grade: "B",
        lastActive: new Date("2024-01-25"),
        totalAssignments: 10,
        completedAssignments: 8,
        avgScore: 79
      }
    ];

    setStudents(mockStudents);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
    if (grade.startsWith("D")) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === "all" || student.course === courseFilter;
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const columns = [
    {
      accessorKey: "name",
      header: "Student",
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback>
              {row.original.name.split(" ").map((n: string) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: "course",
      header: "Course"
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status}
        </Badge>
      )
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${row.original.progress}%` }}
            ></div>
          </div>
          <span className="text-sm">{row.original.progress}%</span>
        </div>
      )
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }: any) => (
        <Badge className={getGradeColor(row.original.grade)}>
          {row.original.grade}
        </Badge>
      )
    },
    {
      accessorKey: "completedAssignments",
      header: "Assignments",
      cell: ({ row }: any) => (
        `${row.original.completedAssignments}/${row.original.totalAssignments}`
      )
    },
    {
      accessorKey: "avgScore",
      header: "Avg Score",
      cell: ({ row }: any) => `${row.original.avgScore}%`
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }: any) => {
        const date = new Date(row.original.lastActive);
        return date.toLocaleDateString();
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <UserX className="mr-2 h-4 w-4" />
              Remove from Course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <InstructorHeader title="Students" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-gray-500">Loading students...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InstructorHeader title="Students" />
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.status === "active").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.reduce((sum, s) => sum + s.avgScore, 0) / students.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="Web Development Fundamentals">Web Development</SelectItem>
                <SelectItem value="Frontend Mastery">Frontend Mastery</SelectItem>
                <SelectItem value="Backend Development">Backend Development</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredStudents} />
        </CardContent>
      </Card>
    </div>
  );
}