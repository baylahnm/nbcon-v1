import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  Download,
  Building,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Plus,
  Grid3X3,
  List,
  SlidersHorizontal,
  ExternalLink,
  Award,
  Shield,
  Clock,
  CheckCircle,
  Construction
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Vendor {
  id: string;
  name: string;
  nameArabic?: string;
  logo?: string;
  category: string;
  subCategory?: string;
  rating: number;
  reviews: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  location: string;
  city: string;
  country: string;
  contact: string;
  email: string;
  phone: string;
  website?: string;
  establishedYear: number;
  employeeCount: string;
  contractValue: number;
  activeContracts: number;
  completedProjects: number;
  lastActivity: string;
  specializations: string[];
  certifications: string[];
  isPreferred: boolean;
  responseTime: string;
  reliability: number;
}

export function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('name');

  // Sample vendors data with Saudi business context
  const vendors: Vendor[] = [
    {
      id: '1',
      name: 'Al-Rajhi Engineering Supplies',
      nameArabic: 'شركة الراجحي للتوريدات الهندسية',
      category: 'Construction Materials',
      subCategory: 'Steel & Concrete',
      rating: 4.8,
      reviews: 127,
      status: 'active',
      location: 'Riyadh, Saudi Arabia',
      city: 'Riyadh',
      country: 'Saudi Arabia',
      contact: 'Abdullah Al-Rajhi',
      email: 'abdullah@alrajhi-eng.sa',
      phone: '+966 11 234 5678',
      website: 'www.alrajhi-engineering.sa',
      establishedYear: 1995,
      employeeCount: '500+',
      contractValue: 15500000,
      activeContracts: 8,
      completedProjects: 142,
      lastActivity: '2024-09-25',
      specializations: ['Steel Structures', 'Concrete Supply', 'Rebar Installation'],
      certifications: ['ISO 9001', 'SASO', 'Saudi Building Code'],
      isPreferred: true,
      responseTime: '< 2 hours',
      reliability: 98
    },
    {
      id: '2',
      name: 'SABIC Industrial Solutions',
      nameArabic: 'سابك للحلول الصناعية',
      category: 'Chemicals & Materials',
      subCategory: 'Industrial Chemicals',
      rating: 4.9,
      reviews: 203,
      status: 'active',
      location: 'Jubail, Saudi Arabia',
      city: 'Jubail',
      country: 'Saudi Arabia',
      contact: 'Fatima Al-Zahra',
      email: 'fatima@sabic.com',
      phone: '+966 13 456 7890',
      website: 'www.sabic.com',
      establishedYear: 1976,
      employeeCount: '1000+',
      contractValue: 28750000,
      activeContracts: 12,
      completedProjects: 89,
      lastActivity: '2024-09-24',
      specializations: ['Petrochemicals', 'Polymers', 'Specialty Chemicals'],
      certifications: ['ISO 14001', 'OHSAS 18001', 'RC14001'],
      isPreferred: true,
      responseTime: '< 1 hour',
      reliability: 99
    },
    {
      id: '3',
      name: 'Saudi Equipment Rental Co.',
      nameArabic: 'الشركة السعودية لتأجير المعدات',
      category: 'Heavy Equipment',
      subCategory: 'Construction Machinery',
      rating: 4.5,
      reviews: 89,
      status: 'active',
      location: 'Dammam, Saudi Arabia',
      city: 'Dammam',
      country: 'Saudi Arabia',
      contact: 'Mohammed Al-Otaibi',
      email: 'mohammed@ser.sa',
      phone: '+966 13 789 0123',
      website: 'www.saudi-equipment.sa',
      establishedYear: 2005,
      employeeCount: '201-500',
      contractValue: 8900000,
      activeContracts: 6,
      completedProjects: 67,
      lastActivity: '2024-09-23',
      specializations: ['Excavators', 'Cranes', 'Heavy Transport'],
      certifications: ['ISO 9001', 'CE Marking', 'Safety Standards'],
      isPreferred: false,
      responseTime: '< 4 hours',
      reliability: 87
    },
    {
      id: '4',
      name: 'Advanced Tech Systems',
      nameArabic: 'أنظمة التقنية المتقدمة',
      category: 'IT & Electronics',
      subCategory: 'System Integration',
      rating: 4.3,
      reviews: 156,
      status: 'active',
      location: 'Jeddah, Saudi Arabia',
      city: 'Jeddah',
      country: 'Saudi Arabia',
      contact: 'Sarah Johnson',
      email: 'sarah@advtech.sa',
      phone: '+966 12 345 6789',
      website: 'www.advtech.sa',
      establishedYear: 2010,
      employeeCount: '101-200',
      contractValue: 5600000,
      activeContracts: 4,
      completedProjects: 34,
      lastActivity: '2024-09-22',
      specializations: ['Network Infrastructure', 'Security Systems', 'Smart Building'],
      certifications: ['Cisco Partner', 'Microsoft Gold', 'CompTIA'],
      isPreferred: false,
      responseTime: '< 6 hours',
      reliability: 85
    },
    {
      id: '5',
      name: 'Gulf Safety Equipment',
      nameArabic: 'معدات الأمان الخليجية',
      category: 'Safety & Security',
      subCategory: 'Personal Protective Equipment',
      rating: 4.7,
      reviews: 94,
      status: 'active',
      location: 'Khobar, Saudi Arabia',
      city: 'Khobar',
      country: 'Saudi Arabia',
      contact: 'Omar Al-Mansouri',
      email: 'omar@gulfsafety.sa',
      phone: '+966 13 567 8901',
      website: 'www.gulfsafety.sa',
      establishedYear: 2008,
      employeeCount: '51-100',
      contractValue: 3200000,
      activeContracts: 5,
      completedProjects: 78,
      lastActivity: '2024-09-21',
      specializations: ['PPE Equipment', 'Safety Training', 'Emergency Response'],
      certifications: ['CE Marking', 'ANSI Standards', 'OSHA Compliance'],
      isPreferred: true,
      responseTime: '< 3 hours',
      reliability: 92
    },
    {
      id: '6',
      name: 'Red Sea Construction',
      nameArabic: 'إنشاءات البحر الأحمر',
      category: 'Construction Services',
      subCategory: 'General Contracting',
      rating: 4.4,
      reviews: 67,
      status: 'pending',
      location: 'Tabuk, Saudi Arabia',
      city: 'Tabuk',
      country: 'Saudi Arabia',
      contact: 'Ahmed Al-Ghamdi',
      email: 'ahmed@redsea-const.sa',
      phone: '+966 14 234 5678',
      establishedYear: 2018,
      employeeCount: '201-500',
      contractValue: 0,
      activeContracts: 0,
      completedProjects: 23,
      lastActivity: '2024-09-15',
      specializations: ['Infrastructure', 'Commercial Buildings', 'Roads'],
      certifications: ['ISO 9001', 'Saudi Contractor License'],
      isPreferred: false,
      responseTime: '< 24 hours',
      reliability: 78
    },
    {
      id: '7',
      name: 'NEOM Tech Solutions',
      nameArabic: 'حلول نيوم التقنية',
      category: 'IT & Electronics',
      subCategory: 'Smart City Technologies',
      rating: 4.6,
      reviews: 42,
      status: 'active',
      location: 'NEOM, Saudi Arabia',
      city: 'NEOM',
      country: 'Saudi Arabia',
      contact: 'Dr. Khalid Al-Ahmed',
      email: 'khalid@neomtech.sa',
      phone: '+966 15 123 4567',
      website: 'www.neomtech.sa',
      establishedYear: 2020,
      employeeCount: '101-200',
      contractValue: 12400000,
      activeContracts: 7,
      completedProjects: 18,
      lastActivity: '2024-09-26',
      specializations: ['IoT Solutions', 'AI Integration', 'Sustainable Tech'],
      certifications: ['ISO 27001', 'CITC License', 'Green Building'],
      isPreferred: true,
      responseTime: '< 1 hour',
      reliability: 94
    },
    {
      id: '8',
      name: 'Eastern Province Logistics',
      nameArabic: 'لوجستيات المنطقة الشرقية',
      category: 'Transportation & Logistics',
      subCategory: 'Supply Chain Management',
      rating: 4.2,
      reviews: 113,
      status: 'inactive',
      location: 'Dhahran, Saudi Arabia',
      city: 'Dhahran',
      country: 'Saudi Arabia',
      contact: 'Nadia Al-Khatib',
      email: 'nadia@epl.sa',
      phone: '+966 13 890 1234',
      establishedYear: 2012,
      employeeCount: '51-100',
      contractValue: 4800000,
      activeContracts: 0,
      completedProjects: 56,
      lastActivity: '2024-08-15',
      specializations: ['Freight Management', 'Warehousing', 'Last Mile Delivery'],
      certifications: ['ISO 9001', 'IATA Certification'],
      isPreferred: false,
      responseTime: '< 12 hours',
      reliability: 81
    }
  ];

  const categories = [
    'Construction Materials',
    'Chemicals & Materials', 
    'Heavy Equipment',
    'IT & Electronics',
    'Safety & Security',
    'Construction Services',
    'Transportation & Logistics'
  ];

  const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Khobar', 'Jubail', 'Tabuk', 'NEOM', 'Dhahran'];

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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.nameArabic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || vendor.status === selectedStatus;
    const matchesLocation = selectedLocation === 'all' || vendor.city === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  const sortedVendors = filteredVendors.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'contractValue':
        return b.contractValue - a.contractValue;
      case 'reliability':
        return b.reliability - a.reliability;
      case 'lastActivity':
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Vendors Directory</h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive vendor management and supplier directory
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors, categories, or specializations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="contractValue">Contract Value</SelectItem>
              <SelectItem value="reliability">Reliability</SelectItem>
              <SelectItem value="lastActivity">Last Activity</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedVendors.length} of {vendors.length} vendors
        </p>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            {vendors.filter(v => v.isPreferred).length} Preferred Vendors
          </Badge>
        </div>
      </div>

      {/* Vendors Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={vendor.logo} />
                        <AvatarFallback>
                          {vendor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium truncate">{vendor.name}</h4>
                          {vendor.isPreferred && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        {vendor.nameArabic && (
                          <p className="text-sm text-muted-foreground truncate" dir="rtl">
                            {vendor.nameArabic}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">{vendor.category}</p>
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
                      <span className={cn("font-medium", getRatingColor(vendor.rating))}>
                        {vendor.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({vendor.reviews} reviews)
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {vendor.reliability}% reliability
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{vendor.city}, {vendor.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{vendor.contact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Est. {vendor.establishedYear}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Response: {vendor.responseTime}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{formatCurrency(vendor.contractValue)}</div>
                        <div className="text-muted-foreground">Contract Value</div>
                      </div>
                      <div>
                        <div className="font-medium">{vendor.activeContracts}</div>
                        <div className="text-muted-foreground">Active Contracts</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {vendor.specializations.slice(0, 2).map((spec, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {vendor.specializations.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{vendor.specializations.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {vendor.website && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedVendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={vendor.logo} />
                        <AvatarFallback>
                          {vendor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{vendor.name}</h4>
                          {vendor.isPreferred && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                          <Badge className={cn(getStatusColor(vendor.status), "text-xs")}>
                            {vendor.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{vendor.category}</span>
                          <span>{vendor.city}</span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {vendor.rating} ({vendor.reviews})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{formatCurrency(vendor.contractValue)}</div>
                        <div className="text-muted-foreground">Contract Value</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{vendor.activeContracts}</div>
                        <div className="text-muted-foreground">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{vendor.reliability}%</div>
                        <div className="text-muted-foreground">Reliability</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        {vendor.website && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedVendors.length === 0 && (
        <div className="flex-1 flex items-center justify-center min-h-96">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No vendors found</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Try adjusting your search criteria or filters to find more vendors.
              </p>
            </div>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSelectedLocation('all');
            }}>
              Clear All Filters
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}