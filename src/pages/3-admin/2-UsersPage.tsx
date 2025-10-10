import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNamespace } from '../1-HomePage/others/lib/i18n/useNamespace';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/pages/1-HomePage/others/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  Upload
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'engineer' | 'client' | 'enterprise' | 'admin';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  verified: boolean;
  avatar?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  lastLogin?: string;
  projects: number;
  earnings?: number;
  spendings?: number;
  company?: string;
  sceLicense?: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed.alrashid@example.com',
    role: 'engineer',
    status: 'active',
    verified: true,
    avatar: '/api/placeholder/40/40',
    phone: '+966 50 123 4567',
    location: 'Riyadh, Saudi Arabia',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20',
    projects: 15,
    earnings: 125000,
    sceLicense: 'SCE-12345'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'client',
    status: 'active',
    verified: true,
    avatar: '/api/placeholder/40/40',
    phone: '+966 50 987 6543',
    location: 'Jeddah, Saudi Arabia',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-19',
    projects: 8,
    spendings: 85000,
    company: 'Saudi Aramco'
  },
  {
    id: '3',
    name: 'Mohammed Al-Zahrani',
    email: 'mohammed.alzahrani@example.com',
    role: 'engineer',
    status: 'pending',
    verified: false,
    phone: '+966 50 555 1234',
    location: 'Dammam, Saudi Arabia',
    createdAt: '2024-01-18',
    projects: 0,
    sceLicense: 'SCE-67890'
  },
  {
    id: '4',
    name: 'ACWA Power',
    email: 'hr@acwapower.com',
    role: 'enterprise',
    status: 'active',
    verified: true,
    avatar: '/api/placeholder/40/40',
    phone: '+966 11 234 5678',
    location: 'Riyadh, Saudi Arabia',
    createdAt: '2024-01-05',
    lastLogin: '2024-01-20',
    projects: 25,
    spendings: 250000,
    company: 'ACWA Power'
  }
];

const userRoles = ['All', 'Engineer', 'Client', 'Enterprise', 'Admin'];
const userStatuses = ['All', 'Active', 'Inactive', 'Pending', 'Suspended'];

export default function UsersPage() {
  const ready = useNamespace(['admin', 'common']);
  const { t } = useTranslation(['admin', 'common']);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  if (!ready) return null;

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === 'All' || user.role === selectedRole.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'engineer': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-3 w-3" />;
      case 'inactive': return <Clock className="h-3 w-3" />;
      case 'pending': return <AlertCircle className="h-3 w-3" />;
      case 'suspended': return <Shield className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const pendingUsers = mockUsers.filter(u => u.status === 'pending').length;
  const verifiedUsers = mockUsers.filter(u => u.verified).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground">Manage all platform users and their accounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{totalUsers}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">{activeUsers}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">{pendingUsers}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">{verifiedUsers}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {userRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {userStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="engineers">Engineers ({mockUsers.filter(u => u.role === 'engineer').length})</TabsTrigger>
          <TabsTrigger value="clients">Clients ({mockUsers.filter(u => u.role === 'client').length})</TabsTrigger>
          <TabsTrigger value="enterprises">Enterprises ({mockUsers.filter(u => u.role === 'enterprise').length})</TabsTrigger>
        </TabsList>

        {/* All Users Tab */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredUsers.map((user, index) => (
                  <div key={user.id} className={`flex items-center justify-between p-4 ${index !== filteredUsers.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          {user.verified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          )}
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {user.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                          {user.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {user.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {user.createdAt}
                          </div>
                        </div>
                        {user.company && (
                          <p className="text-xs text-muted-foreground mt-1">{user.company}</p>
                        )}
                        {user.sceLicense && (
                          <p className="text-xs text-muted-foreground">SCE: {user.sceLicense}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getStatusColor(user.status)}>
                            {getStatusIcon(user.status)}
                            <span className="ml-1 capitalize">{user.status}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Projects: {user.projects}</div>
                          {user.earnings && (
                            <div>Earnings: {user.earnings.toLocaleString()} SAR</div>
                          )}
                          {user.spendings && (
                            <div>Spent: {user.spendings.toLocaleString()} SAR</div>
                          )}
                          {user.lastLogin && (
                            <div>Last login: {user.lastLogin}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engineers Tab */}
        <TabsContent value="engineers" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {mockUsers.filter(u => u.role === 'engineer').map((user, index) => (
                  <div key={user.id} className={`flex items-center justify-between p-4 ${index !== mockUsers.filter(u => u.role === 'engineer').length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          {user.verified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {user.sceLicense && (
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {user.sceLicense}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {user.earnings?.toLocaleString()} SAR earned
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1 capitalize">{user.status}</span>
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div>Projects: {user.projects}</div>
                          {user.lastLogin && (
                            <div>Last login: {user.lastLogin}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {mockUsers.filter(u => u.role === 'client').map((user, index) => (
                  <div key={user.id} className={`flex items-center justify-between p-4 ${index !== mockUsers.filter(u => u.role === 'client').length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          {user.verified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {user.company && (
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {user.company}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            {user.spendings?.toLocaleString()} SAR spent
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1 capitalize">{user.status}</span>
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div>Projects: {user.projects}</div>
                          {user.lastLogin && (
                            <div>Last login: {user.lastLogin}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enterprises Tab */}
        <TabsContent value="enterprises" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {mockUsers.filter(u => u.role === 'enterprise').map((user, index) => (
                  <div key={user.id} className={`flex items-center justify-between p-4 ${index !== mockUsers.filter(u => u.role === 'enterprise').length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          {user.verified && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {user.company && (
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {user.company}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            {user.spendings?.toLocaleString()} SAR spent
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(user.status)}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1 capitalize">{user.status}</span>
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div>Projects: {user.projects}</div>
                          {user.lastLogin && (
                            <div>Last login: {user.lastLogin}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

