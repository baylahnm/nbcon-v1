import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Download,
  Eye,
  Calculator
} from 'lucide-react';
import { useQuotationBuilder } from '../../hooks/useQuotationBuilder';
import { QuotationItem } from '../../types/quotation';
import { formatCurrency } from '../../utils/quotationHelpers';

interface QuotationBuilderProps {
  onSave?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
}

const QuotationBuilder: React.FC<QuotationBuilderProps> = ({ 
  onSave, 
  onPreview, 
  onExport 
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
    clearDraft
  } = useQuotationBuilder();

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
    <div className="w-full p-6 space-y-6">
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

      <div className="grid grid-cols-1 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Quotation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quotation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quotationNumber">Quotation Number</Label>
                  <Input
                    id="quotationNumber"
                    placeholder="Auto-generated"
                    value={formData.quotationNumber}
                    onChange={(e) => updateField('quotationNumber', e.target.value)}
                    className={errors.quotationNumber ? 'border-red-500' : ''}
                  />
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
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
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
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
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
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quotation Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quotation Items</CardTitle>
              <Button onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                    <div className="col-span-1">
                      <Label>#</Label>
                      <div className="h-10 flex items-center justify-center font-medium text-sm bg-muted rounded">
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
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
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
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Additional notes or comments..."
                rows={4}
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Totals Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Totals Summary</CardTitle>
            </CardHeader>
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuotationBuilder;
