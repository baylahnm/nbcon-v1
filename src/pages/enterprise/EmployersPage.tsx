import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { R, RH } from '@/lib/routes';
import { 
  Users,
  Plus,
  Search,
  Filter,
  Download,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Upload,
  Edit,
  MoreHorizontal,
  User,
  Building,
  Shield,
  BookOpen,
  Star,
  Briefcase,
  Target,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Employee {
  id: string;
  name: string;
  arabicName: string;
  position: string;
  department: string;
  salary: number;
  nationalId: string;
  nationality: string;
  joinDate: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  contractType: 'full-time' | 'part-time' | 'contract';
  saudiNational: boolean;
}

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'not-started';
  cpdHours: number;
  dueDate?: string;
}

interface ComplianceItem {
  id: string;
  title: string;
  category: 'labor-law' | 'saudization' | 'safety' | 'tax';
  status: 'compliant' | 'pending' | 'overdue';
  dueDate: string;
  description: string;
  responsible: string;
}

export function EmployersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('payroll');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  
  // Sheet states for right-side panels
  const [showEmployeeDetails, setShowEmployeeDetails] = useState<string | null>(null);
  const [showCourseDetails, setShowCourseDetails] = useState<string | null>(null);
  const [showComplianceDetails, setShowComplianceDetails] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showUploadCertificate, setShowUploadCertificate] = useState(false);

  // URL parameter management
  const updateQuery = (params: Record<string, string | undefined>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.replaceState({}, '', url.toString());
  };

  // Initialize from URL on mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const tab = url.searchParams.get('tab') || 'payroll';
    const employee = url.searchParams.get('employee');
    const course = url.searchParams.get('course');
    const compliance = url.searchParams.get('compliance');
    const filters = url.searchParams.get('filters') === 'true';
    
    setActiveTab(tab);
    setShowEmployeeDetails(employee);
    setShowCourseDetails(course);
    setShowComplianceDetails(compliance);
    setShowFilters(filters);
  }, []);

  // Tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateQuery({ tab: value });
  };

  // Employee actions
  const handleViewEmployee = (employeeId: string) => {
    setShowEmployeeDetails(employeeId);
    updateQuery({ employee: employeeId });
  };

  const handleCloseEmployeeDetails = () => {
    setShowEmployeeDetails(null);
    updateQuery({ employee: undefined });
  };

  // Course actions
  const handleViewCourse = (courseId: string) => {
    setShowCourseDetails(courseId);
    updateQuery({ course: courseId });
  };

  const handleCloseCourseDetails = () => {
    setShowCourseDetails(null);
    updateQuery({ course: undefined });
  };

  // Compliance actions
  const handleViewCompliance = (complianceId: string) => {
    setShowComplianceDetails(complianceId);
    updateQuery({ compliance: complianceId });
  };

  const handleCloseComplianceDetails = () => {
    setShowComplianceDetails(null);
    updateQuery({ compliance: undefined });
  };

  // Export handlers
  const handleExportPayslips = () => {
    console.log('Exporting payslips...');
  };

  const handleGenerateReports = () => {
    console.log('Generating reports...');
  };

  const handleExportLearningData = () => {
    console.log('Exporting learning data...');
  };

  // Sample employee data with Saudi context
  const employees: Employee[] = [
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      arabicName: 'أحمد الراشد',
      position: 'Senior Engineer',
      department: 'Engineering',
      salary: 15000,
      nationalId: '1234567890',
      nationality: 'Saudi',
      joinDate: '2022-01-15',
      email: 'ahmed.rashid@company.sa',
      phone: '+966 50 123 4567',
      status: 'active',
      contractType: 'full-time',
      saudiNational: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      arabicName: 'سارة جونسون',
      position: 'Project Manager',
      department: 'Engineering',
      salary: 18000,
      nationalId: '9876543210',
      nationality: 'Canadian',
      joinDate: '2021-08-20',
      email: 'sarah.johnson@company.sa',
      phone: '+966 55 987 6543',
      status: 'active',
      contractType: 'full-time',
      saudiNational: false
    },
    {
      id: '3',
      name: 'Mohammed Al-Otaibi',
      arabicName: 'محمد العتيبي',
      position: 'Mechanical Engineer',
      department: 'Engineering',
      salary: 12000,
      nationalId: '5555555555',
      nationality: 'Saudi',
      joinDate: '2023-03-10',
      email: 'mohammed.otaibi@company.sa',
      phone: '+966 50 555 5555',
      status: 'active',
      contractType: 'full-time',
      saudiNational: true
    },
    {
      id: '4',
      name: 'Fatima Al-Zahra',
      arabicName: 'فاطمة الزهراء',
      position: 'HR Specialist',
      department: 'Human Resources',
      salary: 10000,
      nationalId: '7777777777',
      nationality: 'Saudi',
      joinDate: '2022-11-05',
      email: 'fatima.zahra@company.sa',
      phone: '+966 50 777 7777',
      status: 'on-leave',
      contractType: 'full-time',
      saudiNational: true
    },
    {
      id: '5',
      name: 'Omar Al-Mansouri',
      arabicName: 'عمر المنصوري',
      position: 'Finance Manager',
      department: 'Finance',
      salary: 16000,
      nationalId: '3333333333',
      nationality: 'Saudi',
      joinDate: '2020-05-15',
      email: 'omar.mansouri@company.sa',
      phone: '+966 50 333 3333',
      status: 'active',
      contractType: 'full-time',
      saudiNational: true
    }
  ];

  // Sample courses data
  const courses: Course[] = [
    {
      id: '1',
      title: 'Saudi Building Code (SBC) Fundamentals',
      category: 'Engineering',
      duration: '40 hours',
      progress: 85,
      status: 'in-progress',
      cpdHours: 40,
      dueDate: '2024-12-31'
    },
    {
      id: '2',
      title: 'OSHA Safety Training',
      category: 'Safety',
      duration: '24 hours',
      progress: 100,
      status: 'completed',
      cpdHours: 24
    },
    {
      id: '3',
      title: 'Project Management Professional (PMP)',
      category: 'Management',
      duration: '60 hours',
      progress: 45,
      status: 'in-progress',
      cpdHours: 60,
      dueDate: '2025-03-15'
    },
    {
      id: '4',
      title: 'Arabic Technical Writing',
      category: 'Communication',
      duration: '20 hours',
      progress: 0,
      status: 'not-started',
      cpdHours: 20,
      dueDate: '2024-11-30'
    }
  ];

  // Sample compliance data
  const complianceItems: ComplianceItem[] = [
    {
      id: '1',
      title: 'Nitaqat Color Classification Review',
      category: 'saudization',
      status: 'compliant',
      dueDate: '2024-12-31',
      description: 'Quarterly review of Saudization ratios and Nitaqat compliance',
      responsible: 'HR Department'
    },
    {
      id: '2',
      title: 'Annual Labor Law Audit',
      category: 'labor-law',
      status: 'pending',
      dueDate: '2024-10-15',
      description: 'Comprehensive review of employment contracts and labor law compliance',
      responsible: 'Legal Department'
    },
    {
      id: '3',
      title: 'Workplace Safety Certification',
      category: 'safety',
      status: 'overdue',
      dueDate: '2024-09-30',
      description: 'Annual workplace safety inspection and certification renewal',
      responsible: 'Safety Officer'
    },
    {
      id: '4',
      title: 'VAT Registration Renewal',
      category: 'tax',
      status: 'compliant',
      dueDate: '2025-01-31',
      description: 'Renewal of VAT registration with ZATCA',
      responsible: 'Finance Department'
    }
  ];

  const departments = ['Engineering', 'Human Resources', 'Finance', 'Operations', 'Sales'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.arabicName.includes(searchTerm) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceIcon = (category: string) => {
    switch (category) {
      case 'labor-law':
        return <FileText className="h-4 w-4" />;
      case 'saudization':
        return <Users className="h-4 w-4" />;
      case 'safety':
        return <Shield className="h-4 w-4" />;
      case 'tax':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const saudiEmployees = employees.filter(emp => emp.saudiNational).length;
  const totalEmployees = employees.length;
  const saudizationRatio = Math.round((saudiEmployees / totalEmployees) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Employers Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage employee payroll, HR processes, learning, and compliance
              </p>
            </div>
          </div>
        </div>
        
        <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name (English)</label>
                <Input placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name (Arabic)</label>
                <Input placeholder="ادخل الاسم الكامل" dir="rtl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Input placeholder="Enter position" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">National ID</label>
                <Input placeholder="Enter national ID" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nationality</label>
                <Input placeholder="Enter nationality" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Enter email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input placeholder="+966 50 123 4567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Salary (SAR)</label>
                <Input type="number" placeholder="Enter salary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Join Date</label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddEmployeeOpen(false)}>
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters(true)}>
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="border-b border-sidebar-border mb-6">
          <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
            <div className="flex items-center w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card hover:scrollbar-thumb-primary/80">
              <TabsTrigger value="payroll" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <DollarSign className="h-4 w-4" />
              Payroll
            </TabsTrigger>
            <TabsTrigger value="hr" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <User className="h-4 w-4" />
              HR
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <BookOpen className="h-4 w-4" />
              Learning
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            </div>
          </TabsList>
        </div>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Salary List</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPayslips}>
                <Download className="h-4 w-4" />
                Export Payslips
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleGenerateReports}>
                <FileText className="h-4 w-4" />
                Generate Reports
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Base Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.avatar} />
                            <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.arabicName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(employee.salary)}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(getStatusColor(employee.status))}>
                          {employee.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewEmployee(employee.id)}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HR Tab */}
        <TabsContent value="hr" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{employee.name}</h4>
                          <p className="text-sm text-muted-foreground">{employee.arabicName}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleViewEmployee(employee.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{employee.position}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{employee.department}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{employee.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{employee.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Joined {employee.joinDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Badge className={cn(getStatusColor(employee.status))}>
                        {employee.status.replace('-', ' ')}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {employee.saudiNational && (
                          <Badge variant="outline" className="text-xs">Saudi</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {employee.contractType}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total CPD Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">284</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this quarter
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Completed Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <div className="flex items-center text-xs text-blue-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  5 this month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Learners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  of {totalEmployees} employees
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg. Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <div className="flex items-center text-xs text-green-600">
                  <Target className="h-3 w-3 mr-1" />
                  Above target
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Training Courses</h3>
              <Button size="sm" className="gap-2" onClick={() => setShowAddCourse(true)}>
                <Plus className="h-4 w-4" />
                Add Course
              </Button>
            </div>

            <div className="grid gap-4">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-medium">{course.title}</h4>
                              <p className="text-sm text-muted-foreground">{course.category}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Award className="h-4 w-4" />
                              <span>{course.cpdHours} CPD Hours</span>
                            </div>
                            {course.dueDate && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Due {course.dueDate}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Progress</span>
                              <span className="text-sm font-medium">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={cn(getStatusColor(course.status))}>
                            {course.status.replace('-', ' ')}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => handleViewCourse(course.id)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Saudization Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{saudizationRatio}%</div>
                <div className="flex items-center text-xs text-green-600">
                  <Users className="h-3 w-3 mr-1" />
                  {saudiEmployees} of {totalEmployees} employees
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Nitaqat Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Green</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Compliant
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pending Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="flex items-center text-xs text-yellow-600">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Require attention
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Compliance Checklist</h3>
              <Button size="sm" className="gap-2" onClick={() => setShowUploadCertificate(true)}>
                <Upload className="h-4 w-4" />
                Upload Certificate
              </Button>
            </div>

            <div className="space-y-3">
              {complianceItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getComplianceIcon(item.category)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <Badge className={cn(getStatusColor(item.status))}>
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Due {item.dueDate}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{item.responsible}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewCompliance(item.id)}>
                          Update
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Right-side Sheets */}
      
      {/* Employee Details Sheet */}
      <Sheet open={!!showEmployeeDetails} onOpenChange={handleCloseEmployeeDetails}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Employee Details</SheetTitle>
            <SheetDescription>
              View and manage employee information, payroll, and HR records.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            {showEmployeeDetails && (() => {
              const employee = employees.find(emp => emp.id === showEmployeeDetails);
              if (!employee) return null;
              
              return (
                <div className="space-y-6">
                  {/* Employee Info */}
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{employee.name}</h3>
                      <p className="text-muted-foreground">{employee.arabicName}</p>
                      <Badge className={cn(getStatusColor(employee.status))}>
                        {employee.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <p className="font-medium">{employee.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Phone</Label>
                        <p className="font-medium">{employee.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">National ID</Label>
                        <p className="font-medium">{employee.nationalId}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Nationality</Label>
                        <p className="font-medium">{employee.nationality}</p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Info */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Employment Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Position</Label>
                        <p className="font-medium">{employee.position}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Department</Label>
                        <p className="font-medium">{employee.department}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Base Salary</Label>
                        <p className="font-medium">{formatCurrency(employee.salary)}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Join Date</Label>
                        <p className="font-medium">{employee.joinDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Employee
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              );
            })()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Course Details Sheet */}
      <Sheet open={!!showCourseDetails} onOpenChange={handleCloseCourseDetails}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Course Details</SheetTitle>
            <SheetDescription>
              View course information, progress tracking, and enrollment details.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            {showCourseDetails && (() => {
              const course = courses.find(c => c.id === showCourseDetails);
              if (!course) return null;
              
              return (
                <div className="space-y-6">
                  {/* Course Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <p className="text-muted-foreground">{course.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        <span>{course.cpdHours} CPD Hours</span>
                      </div>
                      {course.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due {course.dueDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Progress Tracking</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completion</span>
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-3" />
                    </div>
                    <Badge className={cn(getStatusColor(course.status))}>
                      {course.status.replace('-', ' ')}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                </div>
              );
            })()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Compliance Details Sheet */}
      <Sheet open={!!showComplianceDetails} onOpenChange={handleCloseComplianceDetails}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Compliance Details</SheetTitle>
            <SheetDescription>
              View compliance requirements, status updates, and document management.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-6">
            {showComplianceDetails && (() => {
              const compliance = complianceItems.find(c => c.id === showComplianceDetails);
              if (!compliance) return null;
              
              return (
                <div className="space-y-6">
                  {/* Compliance Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {getComplianceIcon(compliance.category)}
                      <div>
                        <h3 className="text-lg font-semibold">{compliance.title}</h3>
                        <p className="text-muted-foreground capitalize">{compliance.category.replace('-', ' ')}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{compliance.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due {compliance.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{compliance.responsible}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Status Information</h4>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Current Status</span>
                        <Badge className={cn(getStatusColor(compliance.status))}>
                          {compliance.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      View Requirements
                    </Button>
                  </div>
                </div>
              );
            })()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Filters Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Advanced Filters</SheetTitle>
            <SheetDescription>
              Filter employees by multiple criteria including status, salary range, and more.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              Advanced filtering options coming soon.
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Course Sheet */}
      <Sheet open={showAddCourse} onOpenChange={setShowAddCourse}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Add New Course</SheetTitle>
            <SheetDescription>
              Create a new training course for employee development.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              Course creation form will be implemented here.
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Upload Certificate Sheet */}
      <Sheet open={showUploadCertificate} onOpenChange={setShowUploadCertificate}>
        <SheetContent className="w-[50vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Upload Certificate</SheetTitle>
            <SheetDescription>
              Upload compliance certificates and supporting documents.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              Certificate upload functionality will be implemented here.
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}