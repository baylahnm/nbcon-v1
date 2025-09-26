import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Download,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building,
  Package,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar as CalendarIcon,
  Settings,
  Activity,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Users,
  DollarSign,
  Zap,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  location: string;
  contact: string;
  email: string;
  phone: string;
  contractValue: number;
  lastOrder: string;
  reliability: number;
}

interface Equipment {
  id: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  location: string;
  purchaseDate: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  utilizationRate: number;
  nextMaintenance: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstocked';
}

interface MaintenanceSchedule {
  id: string;
  equipmentName: string;
  type: 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledDate: string;
  assignedTo: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  estimatedHours: number;
  description: string;
  lastService: string;
}

export function ProcurementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample vendors data with Saudi context
  const vendors: Vendor[] = [
    {
      id: '1',
      name: 'Al-Rajhi Engineering Supplies',
      category: 'Construction Materials',
      rating: 4.8,
      status: 'active',
      location: 'Riyadh, Saudi Arabia',
      contact: 'Abdullah Al-Rajhi',
      email: 'abdullah@alrajhi-eng.sa',
      phone: '+966 11 234 5678',
      contractValue: 2500000,
      lastOrder: '2024-09-15',
      reliability: 95
    },
    {
      id: '2',
      name: 'SABIC Industrial Solutions',
      category: 'Chemicals & Materials',
      rating: 4.9,
      status: 'active',
      location: 'Jubail, Saudi Arabia',
      contact: 'Fatima Al-Zahra',
      email: 'fatima@sabic.com',
      phone: '+966 13 456 7890',
      contractValue: 4200000,
      lastOrder: '2024-09-20',
      reliability: 98
    },
    {
      id: '3',
      name: 'Saudi Equipment Rental',
      category: 'Heavy Equipment',
      rating: 4.5,
      status: 'active',
      location: 'Dammam, Saudi Arabia',
      contact: 'Mohammed Al-Otaibi',
      email: 'mohammed@ser.sa',
      phone: '+966 13 789 0123',
      contractValue: 1800000,
      lastOrder: '2024-09-10',
      reliability: 87
    },
    {
      id: '4',
      name: 'Advanced Tech Systems',
      category: 'IT & Electronics',
      rating: 4.3,
      status: 'pending',
      location: 'Jeddah, Saudi Arabia',
      contact: 'Sarah Johnson',
      email: 'sarah@advtech.sa',
      phone: '+966 12 345 6789',
      contractValue: 950000,
      lastOrder: '2024-08-28',
      reliability: 82
    },
    {
      id: '5',
      name: 'Gulf Safety Equipment',
      category: 'Safety & Security',
      rating: 4.7,
      status: 'active',
      location: 'Khobar, Saudi Arabia',
      contact: 'Omar Al-Mansouri',
      email: 'omar@gulfsafety.sa',
      phone: '+966 13 567 8901',
      contractValue: 1200000,
      lastOrder: '2024-09-18',
      reliability: 91
    }
  ];

  // Sample equipment data
  const equipment: Equipment[] = [
    {
      id: '1',
      name: 'Caterpillar 320D Excavator',
      category: 'Heavy Machinery',
      model: '320D',
      serialNumber: 'CAT320D001',
      status: 'available',
      location: 'NEOM Site A',
      purchaseDate: '2023-03-15',
      condition: 'excellent',
      utilizationRate: 75,
      nextMaintenance: '2024-10-15'
    },
    {
      id: '2',
      name: 'Liebherr Tower Crane',
      category: 'Lifting Equipment',
      model: '280 EC-H 16',
      serialNumber: 'LTM280001',
      status: 'in-use',
      location: 'PIF Headquarters',
      purchaseDate: '2022-11-20',
      condition: 'good',
      utilizationRate: 92,
      nextMaintenance: '2024-11-01'
    },
    {
      id: '3',
      name: 'Surveying Total Station',
      category: 'Surveying Equipment',
      model: 'Leica TS16',
      serialNumber: 'TS16001',
      status: 'maintenance',
      location: 'Red Sea Project',
      purchaseDate: '2023-07-10',
      condition: 'good',
      utilizationRate: 68,
      nextMaintenance: '2024-10-01'
    },
    {
      id: '4',
      name: 'Concrete Mixer Truck',
      category: 'Transport Equipment',
      model: 'Mercedes Arocs 3340',
      serialNumber: 'MB3340001',
      status: 'available',
      location: 'Qiddiya Site',
      purchaseDate: '2023-01-25',
      condition: 'excellent',
      utilizationRate: 84,
      nextMaintenance: '2024-12-01'
    },
    {
      id: '5',
      name: 'Welding Machine Set',
      category: 'Workshop Tools',
      model: 'Lincoln Electric 400',
      serialNumber: 'LE400001',
      status: 'available',
      location: 'Workshop A',
      purchaseDate: '2023-05-12',
      condition: 'good',
      utilizationRate: 45,
      nextMaintenance: '2024-11-15'
    }
  ];

  // Sample inventory data
  const inventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Steel Reinforcement Bars (16mm)',
      category: 'Construction Materials',
      sku: 'SRB-16-001',
      currentStock: 450,
      minStock: 200,
      maxStock: 1000,
      unit: 'tons',
      unitPrice: 2800,
      supplier: 'Al-Rajhi Engineering Supplies',
      lastRestocked: '2024-09-10',
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'Portland Cement (Grade 42.5)',
      category: 'Construction Materials',
      sku: 'PC-42.5-001',
      currentStock: 85,
      minStock: 100,
      maxStock: 500,
      unit: 'bags',
      unitPrice: 25,
      supplier: 'Saudi Cement Company',
      lastRestocked: '2024-09-05',
      status: 'low-stock'
    },
    {
      id: '3',
      name: 'Safety Helmets (White)',
      category: 'Safety Equipment',
      sku: 'SH-WHT-001',
      currentStock: 15,
      minStock: 50,
      maxStock: 200,
      unit: 'pieces',
      unitPrice: 45,
      supplier: 'Gulf Safety Equipment',
      lastRestocked: '2024-08-20',
      status: 'low-stock'
    },
    {
      id: '4',
      name: 'Hydraulic Oil (ISO 46)',
      category: 'Fluids & Lubricants',
      sku: 'HO-46-001',
      currentStock: 0,
      minStock: 20,
      maxStock: 100,
      unit: 'drums',
      unitPrice: 180,
      supplier: 'SABIC Industrial Solutions',
      lastRestocked: '2024-08-01',
      status: 'out-of-stock'
    },
    {
      id: '5',
      name: 'Electrical Cables (4mm²)',
      category: 'Electrical Materials',
      sku: 'EC-4MM-001',
      currentStock: 2800,
      minStock: 500,
      maxStock: 2000,
      unit: 'meters',
      unitPrice: 12,
      supplier: 'Saudi Cable Company',
      lastRestocked: '2024-09-15',
      status: 'overstocked'
    }
  ];

  // Sample maintenance schedule data
  const maintenanceSchedule: MaintenanceSchedule[] = [
    {
      id: '1',
      equipmentName: 'Caterpillar 320D Excavator',
      type: 'preventive',
      priority: 'medium',
      scheduledDate: '2024-10-15',
      assignedTo: 'Ahmed Al-Rashid',
      status: 'scheduled',
      estimatedHours: 8,
      description: 'Engine oil change, hydraulic system check, track inspection',
      lastService: '2024-07-15'
    },
    {
      id: '2',
      equipmentName: 'Liebherr Tower Crane',
      type: 'preventive',
      priority: 'high',
      scheduledDate: '2024-11-01',
      assignedTo: 'Mohammed Al-Otaibi',
      status: 'scheduled',
      estimatedHours: 12,
      description: 'Load test, cable inspection, safety systems check',
      lastService: '2024-08-01'
    },
    {
      id: '3',
      equipmentName: 'Surveying Total Station',
      type: 'corrective',
      priority: 'high',
      scheduledDate: '2024-10-01',
      assignedTo: 'Sarah Johnson',
      status: 'in-progress',
      estimatedHours: 4,
      description: 'Calibration issues, prism constant adjustment',
      lastService: '2024-06-01'
    },
    {
      id: '4',
      equipmentName: 'Concrete Mixer Truck',
      type: 'preventive',
      priority: 'low',
      scheduledDate: '2024-12-01',
      assignedTo: 'Omar Al-Mansouri',
      status: 'scheduled',
      estimatedHours: 6,
      description: 'Routine maintenance, brake system check, mixer drum cleaning',
      lastService: '2024-09-01'
    },
    {
      id: '5',
      equipmentName: 'Generator Set 500kW',
      type: 'emergency',
      priority: 'critical',
      scheduledDate: '2024-09-28',
      assignedTo: 'Ahmed Al-Rashid',
      status: 'overdue',
      estimatedHours: 16,
      description: 'Engine failure, replacement of major components required',
      lastService: '2024-05-15'
    }
  ];

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
      case 'available':
      case 'in-stock':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'retired':
      case 'out-of-stock':
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'maintenance':
      case 'low-stock':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-use':
      case 'overstocked':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStockAlert = (item: InventoryItem) => {
    if (item.status === 'out-of-stock') {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    } else if (item.status === 'low-stock') {
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Procurement Center</h1>
              <p className="text-sm text-muted-foreground">
                Manage vendors, equipment, inventory, and maintenance operations
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input placeholder="Enter company name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">Construction Materials</SelectItem>
                      <SelectItem value="equipment">Heavy Equipment</SelectItem>
                      <SelectItem value="chemicals">Chemicals & Materials</SelectItem>
                      <SelectItem value="safety">Safety & Security</SelectItem>
                      <SelectItem value="it">IT & Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Person</label>
                  <Input placeholder="Enter contact name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="+966 11 234 5678" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="contact@vendor.sa" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input placeholder="City, Saudi Arabia" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddVendorOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddVendorOpen(false)}>
                  Add Vendor
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewPOOpen} onOpenChange={setIsNewPOOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                New Purchase Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vendor</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map(vendor => (
                          <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expected Delivery</label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Items</label>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground">
                      <span>Item Description</span>
                      <span>Quantity</span>
                      <span>Unit Price (SAR)</span>
                      <span>Total</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <Input placeholder="Enter item description" />
                      <Input type="number" placeholder="1" />
                      <Input type="number" placeholder="0.00" />
                      <div className="flex items-center">SAR 0.00</div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewPOOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewPOOpen(false)}>
                  Create Purchase Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors, equipment, or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="safety">Safety</SelectItem>
            <SelectItem value="materials">Materials</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>

        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="vendors" className="space-y-6">
        <div className="border-b border-sidebar-border mb-6">
          <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
            <TabsTrigger value="vendors" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Building className="h-4 w-4" />
              Active Vendors
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Wrench className="h-4 w-4" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2 px-4 py-3 min-w-fit">
              <Settings className="h-4 w-4" />
              Maintenance
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Active Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{vendor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{vendor.name}</h4>
                          <p className="text-sm text-muted-foreground">{vendor.category}</p>
                        </div>
                      </div>
                      <Badge className={cn(getStatusColor(vendor.status))}>
                        {vendor.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{vendor.rating}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {vendor.reliability}% reliability
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor.contact}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor.phone}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Contract Value</span>
                        <span className="font-medium">{formatCurrency(vendor.contractValue)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Order</span>
                        <span>{vendor.lastOrder}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {equipment.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                          <Wrench className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={cn(getStatusColor(item.status))}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                        <Switch 
                          checked={item.status === 'available'} 
                          disabled={item.status === 'maintenance' || item.status === 'retired'}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model</span>
                        <span>{item.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Serial No.</span>
                        <span>{item.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span>{item.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Condition</span>
                        <span className={cn("font-medium", getConditionColor(item.condition))}>
                          {item.condition}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Purchase Date</span>
                        <span>{item.purchaseDate}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Utilization Rate</span>
                        <span className="font-medium">{item.utilizationRate}%</span>
                      </div>
                      <Progress value={item.utilizationRate} className="h-2" />
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Next Maintenance</span>
                        <span className="font-medium">{item.nextMaintenance}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Activity className="h-4 w-4 mr-1" />
                        View History
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Min/Max</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getStockAlert(item)}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell className="text-right">
                        <div className="font-medium">
                          {item.currentStock} {item.unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {item.minStock} / {item.maxStock}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-sm">{item.supplier}</TableCell>
                      <TableCell>
                        <Badge className={cn(getStatusColor(item.status))}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
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

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-xs text-red-600">Needs attention</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-xs text-green-600">This quarter</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Est. Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceSchedule.map((task, index) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{task.equipmentName}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-48">
                            {task.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {task.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(getStatusColor(task.priority))}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{task.scheduledDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{task.estimatedHours}h</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(getStatusColor(task.status))}>
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
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
      </Tabs>
    </div>
  );
}