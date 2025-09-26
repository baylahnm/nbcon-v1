import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Building,
  Edit,
  Save,
  X,
  Upload,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Shield,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  Calendar,
  Users,
  Building2,
  Briefcase,
  Camera,
  Copy,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyInfo {
  companyName: string;
  companyNameArabic: string;
  industry: string;
  foundedYear: string;
  employeeCount: string;
  description: string;
  logo?: string;
}

interface LegalInfo {
  crNumber: string;
  vatNumber: string;
  gosiNumber: string;
  municipalLicense: string;
  issuedDate: string;
  expiryDate: string;
  status: 'active' | 'pending' | 'expired';
}

interface ContactInfo {
  email: string;
  phone: string;
  fax: string;
  website: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface BankInfo {
  bankName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  accountType: string;
  currency: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'verified' | 'pending' | 'rejected';
}

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState(false);

  // Sample company data with Saudi context
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: 'NEOM Engineering Consultants',
    companyNameArabic: 'شركة نيوم للاستشارات الهندسية',
    industry: 'Engineering & Construction',
    foundedYear: '2019',
    employeeCount: '150-200',
    description: 'Leading engineering consultancy specializing in mega-projects and smart city developments across Saudi Arabia. We provide comprehensive engineering solutions for NEOM, PIF, and other Vision 2030 initiatives.',
    logo: undefined
  });

  const [legalInfo, setLegalInfo] = useState<LegalInfo>({
    crNumber: '1010542671',
    vatNumber: '300123456700003',
    gosiNumber: '509876543',
    municipalLicense: 'RUH/2019/ENG/001',
    issuedDate: '2019-03-15',
    expiryDate: '2025-03-15',
    status: 'active'
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'info@neom-engineering.sa',
    phone: '+966 11 234 5678',
    fax: '+966 11 234 5679',
    website: 'www.neom-engineering.sa',
    address: 'King Fahd Road, Al Olaya District',
    city: 'Riyadh',
    postalCode: '11543',
    country: 'Saudi Arabia'
  });

  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bankName: 'Saudi National Bank',
    accountNumber: '1234567890123456',
    iban: 'SA0210000001234567890123',
    swiftCode: 'NCBKSARI',
    accountType: 'Business Current Account',
    currency: 'SAR'
  });

  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Commercial Registration Certificate',
      type: 'CR Certificate',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'verified'
    },
    {
      id: '2',
      name: 'VAT Registration Certificate',
      type: 'VAT Certificate',
      size: '1.8 MB',
      uploadDate: '2024-01-15',
      status: 'verified'
    },
    {
      id: '3',
      name: 'GOSI Registration',
      type: 'GOSI Document',
      size: '1.2 MB',
      uploadDate: '2024-01-15',
      status: 'verified'
    },
    {
      id: '4',
      name: 'Municipal License',
      type: 'License',
      size: '1.9 MB',
      uploadDate: '2024-01-15',
      status: 'verified'
    },
    {
      id: '5',
      name: 'Professional Engineering License',
      type: 'Professional License',
      size: '3.1 MB',
      uploadDate: '2024-02-01',
      status: 'pending'
    },
    {
      id: '6',
      name: 'Insurance Certificate',
      type: 'Insurance',
      size: '2.7 MB',
      uploadDate: '2024-02-10',
      status: 'verified'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
      case 'expired':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setPreviewMode(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewMode(false);
    // Reset any unsaved changes
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Company Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your enterprise information and documentation
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              {!previewMode && (
                <Button variant="outline" onClick={handlePreview} className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              )}
              {previewMode && (
                <Button variant="outline" onClick={() => setPreviewMode(false)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Continue Editing
                </Button>
              )}
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Preview Banner */}
      {previewMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Preview Mode</p>
                <p className="text-sm text-blue-700">This is how your profile will appear after saving.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPreviewMode(false)}>
              Exit Preview
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Company Logo & Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Company Logo</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage src={companyInfo.logo} />
                  <AvatarFallback className="text-2xl">
                    {companyInfo.companyName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && !previewMode && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2"
                    variant="outline"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">{companyInfo.companyName}</h3>
                <p className="text-sm text-muted-foreground">{companyInfo.companyNameArabic}</p>
                <Badge variant="outline">{companyInfo.industry}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">{companyInfo.foundedYear}</div>
                  <div className="text-muted-foreground">Founded</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{companyInfo.employeeCount}</div>
                  <div className="text-muted-foreground">Employees</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="border-b border-sidebar-border mb-6">
              <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
                <TabsTrigger value="basic" className="flex items-center gap-2 px-4 py-3 min-w-fit">
                  <Building2 className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="legal" className="flex items-center gap-2 px-4 py-3 min-w-fit">
                  <Shield className="h-4 w-4" />
                  CR/VAT/GOSI
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2 px-4 py-3 min-w-fit">
                  <Mail className="h-4 w-4" />
                  Contact Details
                </TabsTrigger>
                <TabsTrigger value="banking" className="flex items-center gap-2 px-4 py-3 min-w-fit">
                  <CreditCard className="h-4 w-4" />
                  Bank Info
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name (English)</Label>
                      {isEditing && !previewMode ? (
                        <Input
                          id="companyName"
                          value={companyInfo.companyName}
                          onChange={(e) => setCompanyInfo({...companyInfo, companyName: e.target.value})}
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{companyInfo.companyName}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyNameArabic">Company Name (Arabic)</Label>
                      {isEditing && !previewMode ? (
                        <Input
                          id="companyNameArabic"
                          value={companyInfo.companyNameArabic}
                          onChange={(e) => setCompanyInfo({...companyInfo, companyNameArabic: e.target.value})}
                          dir="rtl"
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md" dir="rtl">{companyInfo.companyNameArabic}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      {isEditing && !previewMode ? (
                        <Select value={companyInfo.industry} onValueChange={(value) => setCompanyInfo({...companyInfo, industry: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Engineering & Construction">Engineering & Construction</SelectItem>
                            <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                            <SelectItem value="Information Technology">Information Technology</SelectItem>
                            <SelectItem value="Finance & Banking">Finance & Banking</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{companyInfo.industry}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="foundedYear">Founded Year</Label>
                      {isEditing && !previewMode ? (
                        <Input
                          id="foundedYear"
                          value={companyInfo.foundedYear}
                          onChange={(e) => setCompanyInfo({...companyInfo, foundedYear: e.target.value})}
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{companyInfo.foundedYear}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">Employee Count</Label>
                      {isEditing && !previewMode ? (
                        <Select value={companyInfo.employeeCount} onValueChange={(value) => setCompanyInfo({...companyInfo, employeeCount: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10</SelectItem>
                            <SelectItem value="11-50">11-50</SelectItem>
                            <SelectItem value="51-100">51-100</SelectItem>
                            <SelectItem value="101-200">101-200</SelectItem>
                            <SelectItem value="201-500">201-500</SelectItem>
                            <SelectItem value="500+">500+</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{companyInfo.employeeCount}</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description</Label>
                    {isEditing && !previewMode ? (
                      <Textarea
                        id="description"
                        value={companyInfo.description}
                        onChange={(e) => setCompanyInfo({...companyInfo, description: e.target.value})}
                        rows={4}
                      />
                    ) : (
                      <div className="p-2 bg-muted rounded-md min-h-20">{companyInfo.description}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Legal Information Tab */}
            <TabsContent value="legal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Legal Registration Information
                    <Badge className={cn(getStatusColor(legalInfo.status))}>
                      {getStatusIcon(legalInfo.status)}
                      <span className="ml-1 capitalize">{legalInfo.status}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="crNumber">Commercial Registration (CR) Number</Label>
                      <div className="flex items-center space-x-2">
                        {isEditing && !previewMode ? (
                          <Input
                            id="crNumber"
                            value={legalInfo.crNumber}
                            onChange={(e) => setLegalInfo({...legalInfo, crNumber: e.target.value})}
                          />
                        ) : (
                          <div className="flex-1 p-2 bg-muted rounded-md font-mono">{legalInfo.crNumber}</div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(legalInfo.crNumber)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vatNumber">VAT Registration Number</Label>
                      <div className="flex items-center space-x-2">
                        {isEditing && !previewMode ? (
                          <Input
                            id="vatNumber"
                            value={legalInfo.vatNumber}
                            onChange={(e) => setLegalInfo({...legalInfo, vatNumber: e.target.value})}
                          />
                        ) : (
                          <div className="flex-1 p-2 bg-muted rounded-md font-mono">{legalInfo.vatNumber}</div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(legalInfo.vatNumber)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gosiNumber">GOSI Registration Number</Label>
                      <div className="flex items-center space-x-2">
                        {isEditing && !previewMode ? (
                          <Input
                            id="gosiNumber"
                            value={legalInfo.gosiNumber}
                            onChange={(e) => setLegalInfo({...legalInfo, gosiNumber: e.target.value})}
                          />
                        ) : (
                          <div className="flex-1 p-2 bg-muted rounded-md font-mono">{legalInfo.gosiNumber}</div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(legalInfo.gosiNumber)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="municipalLicense">Municipal License Number</Label>
                      <div className="flex items-center space-x-2">
                        {isEditing && !previewMode ? (
                          <Input
                            id="municipalLicense"
                            value={legalInfo.municipalLicense}
                            onChange={(e) => setLegalInfo({...legalInfo, municipalLicense: e.target.value})}
                          />
                        ) : (
                          <div className="flex-1 p-2 bg-muted rounded-md font-mono">{legalInfo.municipalLicense}</div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(legalInfo.municipalLicense)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuedDate">Issued Date</Label>
                      {isEditing && !previewMode ? (
                        <Input
                          id="issuedDate"
                          type="date"
                          value={legalInfo.issuedDate}
                          onChange={(e) => setLegalInfo({...legalInfo, issuedDate: e.target.value})}
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{legalInfo.issuedDate}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      {isEditing && !previewMode ? (
                        <Input
                          id="expiryDate"
                          type="date"
                          value={legalInfo.expiryDate}
                          onChange={(e) => setLegalInfo({...legalInfo, expiryDate: e.target.value})}
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{legalInfo.expiryDate}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Details Tab */}
            <TabsContent value="contact" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing && !previewMode ? (
                        <Input
                          id="email"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 p-2 bg-muted rounded-md">{contactInfo.email}</div>
                          <Button variant="ghost" size="sm" onClick={() => window.open(`mailto:${contactInfo.email}`)}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing && !previewMode ? (
                        <Input
                          id="phone"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 p-2 bg-muted rounded-md">{contactInfo.phone}</div>
                          <Button variant="ghost" size="sm" onClick={() => window.open(`tel:${contactInfo.phone}`)}>
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fax">Fax Number</Label>
                      {isEditing && !previewMode ? (
                        <Input
                          id="fax"
                          value={contactInfo.fax}
                          onChange={(e) => setContactInfo({...contactInfo, fax: e.target.value})}
                        />
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{contactInfo.fax}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      {isEditing && !previewMode ? (
                        <Input
                          id="website"
                          value={contactInfo.website}
                          onChange={(e) => setContactInfo({...contactInfo, website: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 p-2 bg-muted rounded-md">{contactInfo.website}</div>
                          <Button variant="ghost" size="sm" onClick={() => window.open(`https://${contactInfo.website}`)}>
                            <Globe className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Business Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        {isEditing && !previewMode ? (
                          <Input
                            id="address"
                            value={contactInfo.address}
                            onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 bg-muted rounded-md">{contactInfo.address}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        {isEditing && !previewMode ? (
                          <Input
                            id="city"
                            value={contactInfo.city}
                            onChange={(e) => setContactInfo({...contactInfo, city: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 bg-muted rounded-md">{contactInfo.city}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        {isEditing && !previewMode ? (
                          <Input
                            id="postalCode"
                            value={contactInfo.postalCode}
                            onChange={(e) => setContactInfo({...contactInfo, postalCode: e.target.value})}
                          />
                        ) : (
                          <div className="p-2 bg-muted rounded-md">{contactInfo.postalCode}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        {isEditing && !previewMode ? (
                          <Select value={contactInfo.country} onValueChange={(value) => setContactInfo({...contactInfo, country: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                              <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                              <SelectItem value="Kuwait">Kuwait</SelectItem>
                              <SelectItem value="Bahrain">Bahrain</SelectItem>
                              <SelectItem value="Qatar">Qatar</SelectItem>
                              <SelectItem value="Oman">Oman</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-2 bg-muted rounded-md">{contactInfo.country}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Banking Information Tab */}
            <TabsContent value="banking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Banking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      {isEditing && !previewMode ? (
                        <Select value={bankInfo.bankName} onValueChange={(value) => setBankInfo({...bankInfo, bankName: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Saudi National Bank">Saudi National Bank</SelectItem>
                            <SelectItem value="Al Rajhi Bank">Al Rajhi Bank</SelectItem>
                            <SelectItem value="Riyad Bank">Riyad Bank</SelectItem>
                            <SelectItem value="Saudi British Bank">Saudi British Bank</SelectItem>
                            <SelectItem value="Arab National Bank">Arab National Bank</SelectItem>
                            <SelectItem value="Banque Saudi Fransi">Banque Saudi Fransi</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{bankInfo.bankName}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      {isEditing && !previewMode ? (
                        <Select value={bankInfo.accountType} onValueChange={(value) => setBankInfo({...bankInfo, accountType: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Business Current Account">Business Current Account</SelectItem>
                            <SelectItem value="Business Savings Account">Business Savings Account</SelectItem>
                            <SelectItem value="Corporate Account">Corporate Account</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{bankInfo.accountType}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <div className="flex items-center space-x-2">
                        {isEditing && !previewMode ? (
                          <Input
                            id="accountNumber"
                            value={bankInfo.accountNumber}
                            onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                          />
                        ) : (
                          <div className="flex-1 p-2 bg-muted rounded-md font-mono">{bankInfo.accountNumber}</div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.accountNumber)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="iban">IBAN</Label>
                      <div className="flex items-center space-x-2">
                        {isEditing && !previewMode ? (
                          <Input
                            id="iban"
                            value={bankInfo.iban}
                            onChange={(e) => setBankInfo({...bankInfo, iban: e.target.value})}
                          />
                        ) : (
                          <div className="flex-1 p-2 bg-muted rounded-md font-mono">{bankInfo.iban}</div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.iban)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="swiftCode">SWIFT Code</Label>
                      <div className="flex items-center space-x-2">
                        {isEditing && !previewMode ? (
                          <Input
                            id="swiftCode"
                            value={bankInfo.swiftCode}
                            onChange={(e) => setBankInfo({...bankInfo, swiftCode: e.target.value})}
                          />
                        ) : (
                          <div className="flex-1 p-2 bg-muted rounded-md font-mono">{bankInfo.swiftCode}</div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.swiftCode)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      {isEditing && !previewMode ? (
                        <Select value={bankInfo.currency} onValueChange={(value) => setBankInfo({...bankInfo, currency: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 bg-muted rounded-md">{bankInfo.currency}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Official Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Official Documents
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.type}</p>
                        </div>
                      </div>
                      <Badge className={cn(getStatusColor(doc.status))}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1 capitalize">{doc.status}</span>
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Size</span>
                        <span>{doc.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uploaded</span>
                        <span>{doc.uploadDate}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}