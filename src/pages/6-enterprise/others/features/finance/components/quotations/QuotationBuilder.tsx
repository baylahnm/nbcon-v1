import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../../1-HomePage/others/components/ui/button';
import { Input } from '../../../../../../1-HomePage/others/components/ui/input';
import { Label } from '../../../../../../1-HomePage/others/components/ui/label';
import { Textarea } from '../../../../../../1-HomePage/others/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../../1-HomePage/others/components/ui/select';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Download,
  Eye,
  Calculator,
  Palette,
  Upload,
  X
} from 'lucide-react';
import { useQuotationBuilder } from '../../hooks/useQuotationBuilder';
import { QuotationItem } from '../../types/quotation';
import { formatCurrency } from '../../utils/quotationHelpers';
import QuotationPreview from './QuotationPreview';

// Helper function to get computed CSS variable values
const getCSSVariableValue = (variable: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  }
  return '';
};

// Helper function to convert HSL values to hex
const hslToHex = (hsl: string): string => {
  if (!hsl || hsl === '') return '#000000';
  
  // Parse HSL values
  const values = hsl.match(/\d+/g);
  if (!values || values.length < 3) return '#000000';
  
  const h = parseInt(values[0]) / 360;
  const s = parseInt(values[1]) / 100;
  const l = parseInt(values[2]) / 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  const r = hue2rgb(p, q, h + 1/3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1/3);
  
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

interface QuotationBuilderProps {
  onSave?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
  existingQuotations?: Array<{ quotationNumber: string }>;
}

const QuotationBuilder: React.FC<QuotationBuilderProps> = ({ 
  onSave, 
  onPreview, 
  onExport,
  existingQuotations = []
}) => {
  const {
    formData,
    errors,
    totals,
    updateField,
    updateNestedField,
    addItem,
    updateItem,
    removeItem,
    updateTerms,
    addCondition,
    updateCondition,
    removeCondition,
    validateForm,
    clearDraft,
    getPreviewQuotation,
    generateNewQuotationNumber
  } = useQuotationBuilder(existingQuotations);

  // Get initial theme colors for display in color pickers
  const getInitialColors = () => {
    const primaryHSL = getCSSVariableValue('--primary');
    const cardHSL = getCSSVariableValue('--card');
    const foregroundHSL = getCSSVariableValue('--foreground');
    
    return {
      headerColor: primaryHSL ? hslToHex(primaryHSL) : '#27c862',
      tableHeaderColor: cardHSL ? hslToHex(cardHSL) : '#f0f0f0',
      headerTextColor: '#ffffff',
      tableTextColor: foregroundHSL ? hslToHex(foregroundHSL) : '#000000',
      signatureStampBgColor: '#f3f4f6'
    };
  };

  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showQuotationDetails, setShowQuotationDetails] = useState(true);
  const [showCompanyInfo, setShowCompanyInfo] = useState(true);
  const [showClientInfo, setShowClientInfo] = useState(true);
  const [showItems, setShowItems] = useState(true);
  const [showTerms, setShowTerms] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [showTotals, setShowTotals] = useState(true);

  // Handle company signature upload
  const handleCompanySignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateNestedField('company', 'signature', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle client signature upload
  const handleClientSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateNestedField('client', 'signature', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove company signature
  const removeCompanySignature = () => {
    updateNestedField('company', 'signature', '');
  };

  // Remove client signature
  const removeClientSignature = () => {
    updateNestedField('client', 'signature', '');
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave?.();
    }
  };

  const handlePreview = () => {
    if (validateForm()) {
      onPreview?.();
    }
  };

  const handleExport = () => {
    if (validateForm()) {
      onExport?.();
    }
  };

  return (
    <div className="w-full p-6 space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-medium">Quotation Builder</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Quotation
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              if (confirm('Are you sure you want to clear the draft? This action cannot be undone.')) {
                clearDraft();
                window.location.reload(); // Refresh to reset form
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Draft
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Quotation Builder */}
        <div className="space-y-6">
          {/* Quotation Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle>Quotation Details</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuotationDetails(!showQuotationDetails)}
              >
                {showQuotationDetails ? 'Hide' : 'Show'}
              </Button>
            </CardHeader>
            {showQuotationDetails && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quotationNumber">Quotation Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="quotationNumber"
                      placeholder="Auto-generated"
                      value={formData.quotationNumber}
                      onChange={(e) => updateField('quotationNumber', e.target.value)}
                      className={errors.quotationNumber ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateNewQuotationNumber}
                      className="shrink-0"
                    >
                      Generate
                    </Button>
                  </div>
                  {errors.quotationNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.quotationNumber}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className={errors.date ? 'border-red-500' : ''}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => updateField('validUntil', e.target.value)}
                    className={errors.validUntil ? 'border-red-500' : ''}
                  />
                  {errors.validUntil && (
                    <p className="text-sm text-red-500 mt-1">{errors.validUntil}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => updateField('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="preparedBy">Prepared By</Label>
                <Input
                  id="preparedBy"
                  placeholder="Name of person preparing the quotation"
                  value={formData.preparedBy}
                  onChange={(e) => updateField('preparedBy', e.target.value)}
                  className={errors.preparedBy ? 'border-red-500' : ''}
                />
                {errors.preparedBy && (
                  <p className="text-sm text-red-500 mt-1">{errors.preparedBy}</p>
                )}
              </div>
            </CardContent>
            )}
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle>Company Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompanyInfo(!showCompanyInfo)}
              >
                {showCompanyInfo ? 'Hide' : 'Show'}
              </Button>
            </CardHeader>
            {showCompanyInfo && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Your Company Name"
                  value={formData.company.name || ''}
                  onChange={(e) => updateNestedField('company', 'name', e.target.value)}
                  className={errors['company.name'] ? 'border-red-500' : ''}
                />
                {errors['company.name'] && (
                  <p className="text-sm text-red-500 mt-1">{errors['company.name']}</p>
                )}
              </div>
              <div>
                <Label htmlFor="companyAddress">Address</Label>
                <Textarea
                  id="companyAddress"
                  placeholder="Your company address"
                  rows={3}
                  value={formData.company.address || ''}
                  onChange={(e) => updateNestedField('company', 'address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    placeholder="company@example.com"
                    value={formData.company.email || ''}
                    onChange={(e) => updateNestedField('company', 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">Phone</Label>
                  <Input
                    id="companyPhone"
                    placeholder="+966 11 123 4567"
                    value={formData.company.phone || ''}
                    onChange={(e) => updateNestedField('company', 'phone', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyVat">VAT Number</Label>
                  <Input
                    id="companyVat"
                    placeholder="VAT Number"
                    value={formData.company.vatNumber || ''}
                    onChange={(e) => updateNestedField('company', 'vatNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="companyCr">CR Number</Label>
                  <Input
                    id="companyCr"
                    placeholder="CR Number"
                    value={formData.company.crNumber || ''}
                    onChange={(e) => updateNestedField('company', 'crNumber', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            )}
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Theme Settings
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemeSettings(!showThemeSettings)}
              >
                {showThemeSettings ? 'Hide' : 'Show'}
              </Button>
            </CardHeader>
            {showThemeSettings && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="header-color" className="text-sm">Header Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="header-color"
                        type="color"
                        value={formData.theme.headerColor}
                        onChange={(e) => updateNestedField('theme', 'headerColor', e.target.value)}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                      />
                      <Input
                        value={formData.theme.headerColor}
                        onChange={(e) => updateNestedField('theme', 'headerColor', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="#27c862"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="header-text-color" className="text-sm">Header Text Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="header-text-color"
                        type="color"
                        value={formData.theme.headerTextColor}
                        onChange={(e) => updateNestedField('theme', 'headerTextColor', e.target.value)}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                      />
                      <Input
                        value={formData.theme.headerTextColor}
                        onChange={(e) => updateNestedField('theme', 'headerTextColor', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="table-header-color" className="text-sm">Table Header Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="table-header-color"
                        type="color"
                        value={formData.theme.tableHeaderColor}
                        onChange={(e) => updateNestedField('theme', 'tableHeaderColor', e.target.value)}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                      />
                      <Input
                        value={formData.theme.tableHeaderColor}
                        onChange={(e) => updateNestedField('theme', 'tableHeaderColor', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="#f0f0f0"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="table-text-color" className="text-sm">Table Text Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="table-text-color"
                        type="color"
                        value={formData.theme.tableTextColor}
                        onChange={(e) => updateNestedField('theme', 'tableTextColor', e.target.value)}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                      />
                      <Input
                        value={formData.theme.tableTextColor}
                        onChange={(e) => updateNestedField('theme', 'tableTextColor', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="signature-bg-color" className="text-sm">Signature Background</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="signature-bg-color"
                        type="color"
                        value={formData.theme.signatureStampBgColor}
                        onChange={(e) => updateNestedField('theme', 'signatureStampBgColor', e.target.value)}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                      />
                      <Input
                        value={formData.theme.signatureStampBgColor}
                        onChange={(e) => updateNestedField('theme', 'signatureStampBgColor', e.target.value)}
                        className="flex-1 text-xs"
                        placeholder="#f3f4f6"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const defaultColors = getInitialColors();
                        updateNestedField('theme', 'headerColor', defaultColors.headerColor);
                        updateNestedField('theme', 'headerTextColor', defaultColors.headerTextColor);
                        updateNestedField('theme', 'tableHeaderColor', defaultColors.tableHeaderColor);
                        updateNestedField('theme', 'tableTextColor', defaultColors.tableTextColor);
                        updateNestedField('theme', 'signatureStampBgColor', defaultColors.signatureStampBgColor);
                      }}
                    >
                      Reset to Default
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm">Company Signature</Label>
                    <div className="border border-gray-300 h-24 rounded flex items-center justify-center relative overflow-hidden">
                      {formData.company.signature ? (
                        <>
                          <img 
                            src={formData.company.signature} 
                            alt="Company Signature" 
                            className="max-h-full max-w-full object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeCompanySignature}
                            className="absolute top-1 right-1 h-6 w-6 p-0 z-10"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <div className="text-center text-gray-500">
                          <Upload className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-xs">Upload Company Signature</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCompanySignatureUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm">Client Signature</Label>
                    <div className="border border-gray-300 h-24 rounded flex items-center justify-center relative overflow-hidden">
                      {formData.client.signature ? (
                        <>
                          <img 
                            src={formData.client.signature} 
                            alt="Client Signature" 
                            className="max-h-full max-w-full object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeClientSignature}
                            className="absolute top-1 right-1 h-6 w-6 p-0 z-10"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <div className="text-center text-gray-500">
                          <Upload className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-xs">Upload Client Signature</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleClientSignatureUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle>Client Information</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClientInfo(!showClientInfo)}
              >
                {showClientInfo ? 'Hide' : 'Show'}
              </Button>
            </CardHeader>
            {showClientInfo && (
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  placeholder="Client company name"
                  value={formData.client.name || ''}
                  onChange={(e) => updateNestedField('client', 'name', e.target.value)}
                  className={errors['client.name'] ? 'border-red-500' : ''}
                />
                {errors['client.name'] && (
                  <p className="text-sm text-red-500 mt-1">{errors['client.name']}</p>
                )}
              </div>
              <div>
                <Label htmlFor="clientAddress">Address</Label>
                <Textarea
                  id="clientAddress"
                  placeholder="Client address"
                  rows={3}
                  value={formData.client.address || ''}
                  onChange={(e) => updateNestedField('client', 'address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={formData.client.email || ''}
                    onChange={(e) => updateNestedField('client', 'email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone">Phone</Label>
                  <Input
                    id="clientPhone"
                    placeholder="+966 11 987 6543"
                    value={formData.client.phone || ''}
                    onChange={(e) => updateNestedField('client', 'phone', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientVat">VAT Number</Label>
                  <Input
                    id="clientVat"
                    placeholder="VAT Number"
                    value={formData.client.vatNumber || ''}
                    onChange={(e) => updateNestedField('client', 'vatNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientCr">CR Number</Label>
                  <Input
                    id="clientCr"
                    placeholder="CR Number"
                    value={formData.client.crNumber || ''}
                    onChange={(e) => updateNestedField('client', 'crNumber', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            )}
          </Card>

          {/* Quotation Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle>Quotation Items</CardTitle>
              <div className="flex gap-2">
                <Button onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowItems(!showItems)}
                >
                  {showItems ? 'Hide' : 'Show'}
                </Button>
              </div>
            </CardHeader>
            {showItems && (
            <CardContent>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                    <div className="col-span-1">
                      <Label>#</Label>
                      <div className="h-10 flex items-center justify-center font-medium text-sm bg-muted rounded w-8">
                        {index + 1}
                      </div>
                    </div>
                    <div className="col-span-4">
                      <Label>Description</Label>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className={errors[`items.${index}.description`] ? 'border-red-500' : ''}
                      />
                      {errors[`items.${index}.description`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`items.${index}.description`]}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Label>Unit</Label>
                      <Select
                        value={item.unit}
                        onValueChange={(value) => updateItem(item.id, 'unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pcs">Pieces</SelectItem>
                          <SelectItem value="hrs">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="sqm">Square Meter</SelectItem>
                          <SelectItem value="kg">Kilogram</SelectItem>
                          <SelectItem value="m">Meter</SelectItem>
                          <SelectItem value="l">Liter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <Label>Qty</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className={errors[`items.${index}.quantity`] ? 'border-red-500' : ''}
                      />
                      {errors[`items.${index}.quantity`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`items.${index}.quantity`]}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className={errors[`items.${index}.unitPrice`] ? 'border-red-500' : ''}
                      />
                      {errors[`items.${index}.unitPrice`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`items.${index}.unitPrice`]}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Label>Total</Label>
                      <div className="h-10 flex items-center font-medium text-sm bg-muted rounded px-3">
                        {formatCurrency(item.total, formData.currency)}
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {formData.items.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No items added yet</p>
                    <p className="text-sm">Click "Add Item" to start building your quotation</p>
                  </div>
                )}
              </div>
            </CardContent>
            )}
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle>Terms & Conditions</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTerms(!showTerms)}
              >
                {showTerms ? 'Hide' : 'Show'}
              </Button>
            </CardHeader>
            {showTerms && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validity">Validity Period (Days)</Label>
                  <Input
                    id="validity"
                    type="number"
                    min="1"
                    value={formData.terms.validity}
                    onChange={(e) => updateTerms('validity', parseInt(e.target.value) || 30)}
                  />
                </div>
                <div>
                  <Label>VAT Rate (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.terms.vatRate || 15}
                    onChange={(e) => updateTerms('vatRate', parseFloat(e.target.value) || 15)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Textarea
                  id="paymentTerms"
                  placeholder="e.g., 50% advance, 50% on completion"
                  rows={2}
                  value={formData.terms.paymentTerms}
                  onChange={(e) => updateTerms('paymentTerms', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="deliveryTerms">Delivery Terms</Label>
                <Textarea
                  id="deliveryTerms"
                  placeholder="e.g., Delivery within 30 days"
                  rows={2}
                  value={formData.terms.deliveryTerms}
                  onChange={(e) => updateTerms('deliveryTerms', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="warranty">Warranty</Label>
                <Textarea
                  id="warranty"
                  placeholder="e.g., 1 year warranty on all products"
                  rows={2}
                  value={formData.terms.warranty}
                  onChange={(e) => updateTerms('warranty', e.target.value)}
                />
              </div>
              <div>
                <Label>Additional Terms</Label>
                <div className="space-y-2">
                  {formData.terms.conditions.map((condition, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Additional term"
                        value={condition}
                        onChange={(e) => updateCondition(index, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addCondition}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Term
                  </Button>
                </div>
              </div>
            </CardContent>
            )}
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle>Notes</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotes(!showNotes)}
              >
                {showNotes ? 'Hide' : 'Show'}
              </Button>
            </CardHeader>
            {showNotes && (
            <CardContent>
              <Textarea
                placeholder="Additional notes or comments..."
                rows={4}
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
              />
            </CardContent>
            )}
          </Card>

          {/* Totals Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle>Totals Summary</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTotals(!showTotals)}
              >
                {showTotals ? 'Hide' : 'Show'}
              </Button>
            </CardHeader>
            {showTotals && (
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(totals.subtotal, formData.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT ({formData.terms.vatRate || 15}%):</span>
                <span>{formatCurrency(totals.tax, formData.currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(totals.total, formData.currency)}</span>
              </div>
            </CardContent>
            )}
          </Card>
        </div>

        {/* Right Column - Live Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.items.length > 0 && formData.company.name && formData.client.name ? (
                <div className="scale-75 origin-top-left w-[133.33%] h-[133.33%] overflow-auto">
                  <QuotationPreview
                    quotation={getPreviewQuotation()}
                    onExport={handleExport}
                    onSend={() => console.log('Send functionality coming soon')}
                    onAccept={() => console.log('Accept functionality coming soon')}
                    onReject={() => console.log('Reject functionality coming soon')}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-muted-foreground">
                  <div className="text-center">
                    <p className="text-lg mb-2">No preview available</p>
                    <p className="text-sm">Fill in the required information to see the preview:</p>
                    <ul className="text-sm text-left mt-4">
                      {!formData.company.name && <li>• Company name</li>}
                      {!formData.client.name && <li>• Client name</li>}
                      {formData.items.length === 0 && <li>• At least one item</li>}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuotationBuilder;
