import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Input } from "../../../../../1-HomePage/others/components/ui/input";
import { Label } from "../../../../../1-HomePage/others/components/ui/label";
import { Textarea } from "../../../../../1-HomePage/others/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../1-HomePage/others/components/ui/select";
import { Plus, Trash2, FileText, Download, Upload, X, Save } from "lucide-react";
import QRCode from "qrcode";
import html2pdf from "html2pdf.js";

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

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  lineItems: LineItem[];
  notes: string;
  taxRate: number;
  discountRate: number;
  gstin: string;
  pan: string;
  clientGstin: string;
  clientPan: string;
  placeOfSupply: string;
  countryOfSupply: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  logo: string | null;
  secondaryCurrency: string;
  issuerName: string;
}

interface InvoiceBuilderProps {
  onClose: () => void;
}

export function InvoiceBuilder({ onClose }: InvoiceBuilderProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  
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
  
  const initialColors = getInitialColors();
  
  const [headerColor, setHeaderColor] = useState(initialColors.headerColor);
  const [tableHeaderColor, setTableHeaderColor] = useState(initialColors.tableHeaderColor);
  const [signatureStampBgColor, setSignatureStampBgColor] = useState(initialColors.signatureStampBgColor);
  const [headerTextColor, setHeaderTextColor] = useState(initialColors.headerTextColor);
  const [tableTextColor, setTableTextColor] = useState(initialColors.tableTextColor);
  const [signatureStamp, setSignatureStamp] = useState<string | null>(null);
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    lineItems: [{ id: "1", description: "", quantity: 1, rate: 0, amount: 0 }],
    notes: "",
    taxRate: 15,
    discountRate: 0,
    gstin: "",
    pan: "",
    clientGstin: "",
    clientPan: "",
    placeOfSupply: "",
    countryOfSupply: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    logo: null,
    secondaryCurrency: "SAR",
    issuerName: "",
  });

  const updateInvoiceData = useCallback((field: keyof InvoiceData, value: any) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addLineItem = useCallback(() => {
    const newItem: LineItem = {
      id: Date.now().toString(),
  description: "",
  quantity: 1,
  rate: 0,
  amount: 0,
    };
    setInvoiceData((prev) => ({ ...prev, lineItems: [...prev.lineItems, newItem] }));
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setInvoiceData((prev) => ({ ...prev, lineItems: prev.lineItems.filter((item) => item.id !== id) }));
  }, []);

  const updateLineItem = useCallback((id: string, field: keyof LineItem, value: any) => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  }, []);

  const calculateSubtotal = useCallback(() => {
    return invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0);
  }, [invoiceData.lineItems]);

  const calculateDiscount = useCallback(() => {
    return (calculateSubtotal() * invoiceData.discountRate) / 100;
  }, [calculateSubtotal, invoiceData.discountRate]);

  const calculateTax = useCallback(() => {
    return ((calculateSubtotal() - calculateDiscount()) * invoiceData.taxRate) / 100;
  }, [calculateSubtotal, calculateDiscount, invoiceData.taxRate]);

  const calculateTotal = useCallback(() => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  }, [calculateSubtotal, calculateDiscount, calculateTax]);

  const getCurrencySymbol = useCallback((currencyCode: string) => {
    const currencySymbols: { [key: string]: string } = {
      USD: "$", EUR: "€", GBP: "£", INR: "₹", CAD: "C$", AUD: "A$", JPY: "¥", CHF: "CHF", CNY: "¥", SGD: "S$", SAR: "SAR",
    };
    return currencySymbols[currencyCode] || currencyCode;
  }, []);

  const generateQRCode = useCallback(async () => {
    try {
      const subTotal = calculateSubtotal();
      const discount = calculateDiscount();
      const taxable = subTotal - discount;
      const vat = (taxable * invoiceData.taxRate) / 100;
      const totalWithVat = taxable + vat;

      const qrData = JSON.stringify({
        seller: invoiceData.companyName || "Seller",
        vat: invoiceData.gstin || "",
        date: invoiceData.date,
        total: totalWithVat.toFixed(2),
        vatAmount: vat.toFixed(2),
      });

      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 128,
        margin: 1,
        color: { dark: "#000000", light: "#FFFFFF" },
      });

      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR:", error);
    }
  }, [invoiceData.companyName, invoiceData.gstin, invoiceData.date, calculateSubtotal, calculateDiscount, invoiceData.taxRate]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  // Update colors when theme changes
  useEffect(() => {
    const updateThemeColors = () => {
      const primaryHSL = getCSSVariableValue('--primary');
      const cardHSL = getCSSVariableValue('--card');
      const foregroundHSL = getCSSVariableValue('--foreground');
      
      // Only update if we haven't manually changed the colors
      if (primaryHSL && headerColor === initialColors.headerColor) {
        setHeaderColor(hslToHex(primaryHSL));
      }
      if (cardHSL && tableHeaderColor === initialColors.tableHeaderColor) {
        setTableHeaderColor(hslToHex(cardHSL));
      }
      if (foregroundHSL && tableTextColor === initialColors.tableTextColor) {
        setTableTextColor(hslToHex(foregroundHSL));
      }
    };

    // Update colors on theme change
    updateThemeColors();
    
    // Listen for theme changes (if using a theme store)
    const interval = setInterval(updateThemeColors, 1000);
    
    return () => clearInterval(interval);
  }, [headerColor, tableHeaderColor, tableTextColor, initialColors]);

  const handleExportPDF = async () => {
    const invoiceContent = document.querySelector(".invoice-preview") as HTMLElement;
    if (invoiceContent) {
      const options = {
        margin: 0,
        filename: `Invoice_${invoiceData.invoiceNumber}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      };

      try {
        await html2pdf().set(options).from(invoiceContent).save();
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  const handleSave = () => {
    try {
      const payload = {
        invoiceData,
        theme: {
          headerColor,
          headerTextColor,
          tableHeaderColor,
          tableTextColor,
          signatureStampBgColor,
        },
        signatureStamp,
      };
      localStorage.setItem("invoice-builder-draft", JSON.stringify(payload));
      alert("Invoice saved.");
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice.");
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-medium">Proforma Invoice Builder</h1>
        </div>
        <div className="flex gap-2 mx-6">
          <Button onClick={handleExportPDF} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => updateInvoiceData("invoiceNumber", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => updateInvoiceData("date", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => updateInvoiceData("dueDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="secondaryCurrency">Currency</Label>
                  <Select
                    value={invoiceData.secondaryCurrency}
                    onValueChange={(value) => updateInvoiceData("secondaryCurrency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                      <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                      <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="issuerName">Issued By</Label>
                <Input
                  id="issuerName"
                  value={invoiceData.issuerName}
                  onChange={(e) => updateInvoiceData("issuerName", e.target.value)}
                  placeholder="Name of person issuing the invoice"
                />
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
                  value={invoiceData.companyName}
                  onChange={(e) => updateInvoiceData("companyName", e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <Label htmlFor="companyAddress">Address</Label>
                <Textarea
                  id="companyAddress"
                  value={invoiceData.companyAddress}
                  onChange={(e) => updateInvoiceData("companyAddress", e.target.value)}
                  placeholder="Your company address"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={invoiceData.companyEmail}
                    onChange={(e) => updateInvoiceData("companyEmail", e.target.value)}
                    placeholder="company@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="companyPhone">Phone</Label>
                  <Input
                    id="companyPhone"
                    value={invoiceData.companyPhone}
                    onChange={(e) => updateInvoiceData("companyPhone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gstin">VAT</Label>
                  <Input
                    id="gstin"
                    value={invoiceData.gstin}
                    onChange={(e) => updateInvoiceData("gstin", e.target.value)}
                    placeholder="VAT Number"
                  />
                </div>
                <div>
                  <Label htmlFor="pan">CR</Label>
                  <Input
                    id="pan"
                    value={invoiceData.pan}
                    onChange={(e) => updateInvoiceData("pan", e.target.value)}
                    placeholder="CR Number"
                  />
                </div>
              </div>

              {/* Invoice Theme */}
              <div>
                <Label>Invoice Theme</Label>
                <div className="space-y-4 mt-4">
                  {/* Color Pickers */}
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="header-color" className="text-xs">Header Color</Label>
                      <input
                        id="header-color"
                        type="color"
                        value={headerColor}
                        onChange={(e) => setHeaderColor(e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="header-text-color" className="text-xs">Header Text</Label>
                      <input
                        id="header-text-color"
                        type="color"
                        value={headerTextColor}
                        onChange={(e) => setHeaderTextColor(e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="table-header-color" className="text-xs">Table Color</Label>
                      <input
                        id="table-header-color"
                        type="color"
                        value={tableHeaderColor}
                        onChange={(e) => setTableHeaderColor(e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="table-text-color" className="text-xs">Table Text</Label>
                      <input
                        id="table-text-color"
                        type="color"
                        value={tableTextColor}
                        onChange={(e) => setTableTextColor(e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="signature-stamp-bg-color" className="text-xs">Stamp BG</Label>
                      <input
                        id="signature-stamp-bg-color"
                        type="color"
                        value={signatureStampBgColor}
                        onChange={(e) => setSignatureStampBgColor(e.target.value)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer hover:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Logo */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-2 block">Primary Logo</Label>
                      {invoiceData.logo ? (
                        <div className="space-y-2">
                          <div className="w-16 h-16 border border-gray-300 rounded overflow-hidden bg-gray-50">
                            <img src={invoiceData.logo} alt="Primary company logo" className="w-full h-full object-contain" />
                          </div>
                          <Button onClick={() => updateInvoiceData("logo", null)} size="sm" variant="outline" className="text-red-600 hover:text-red-700 h-6 px-2 text-xs">
                            <X className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div
                            className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            onClick={() => document.getElementById("logo-upload")?.click()}
                          >
                            <Upload className="h-4 w-4" />
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                      )}
    <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert("File size should be less than 5MB");
                              return;
                            }
                            if (!file.type.startsWith("image/")) {
                              alert("Please select a valid image file");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const result = e.target?.result as string;
                              updateInvoiceData("logo", result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
    />
  </div>

                    {/* Signature/Stamp */}
                    <div>
                      <Label className="text-xs text-gray-600 mb-2 block">Signature / Stamp</Label>
                      {signatureStamp ? (
                        <div className="space-y-2">
                          <div className="w-16 h-16 border border-gray-300 rounded overflow-hidden bg-gray-50">
                            <img src={signatureStamp} alt="Signature or stamp" className="w-full h-full object-contain" />
                          </div>
                          <Button onClick={() => setSignatureStamp(null)} size="sm" variant="outline" className="text-red-600 hover:text-red-700 h-6 px-2 text-xs">
                            <X className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div
                            className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            onClick={() => document.getElementById("signature-upload")?.click()}
                          >
                            <Upload className="h-4 w-4" />
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                      <Input
                        id="signature-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert("File size should be less than 5MB");
                              return;
                            }
                            if (!file.type.startsWith("image/")) {
                              alert("Please select a valid image file");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (e) => setSignatureStamp(e.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Bill To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={invoiceData.clientName}
                  onChange={(e) => updateInvoiceData("clientName", e.target.value)}
                  placeholder="Client Name"
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Address</Label>
                <Textarea
                  id="clientAddress"
                  value={invoiceData.clientAddress}
                  onChange={(e) => updateInvoiceData("clientAddress", e.target.value)}
                  placeholder="Client address"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={invoiceData.clientEmail}
                  onChange={(e) => updateInvoiceData("clientEmail", e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientGstin">VAT</Label>
                  <Input
                    id="clientGstin"
                    value={invoiceData.clientGstin}
                    onChange={(e) => updateInvoiceData("clientGstin", e.target.value)}
                    placeholder="Client VAT Number"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPan">CR</Label>
                  <Input
                    id="clientPan"
                    value={invoiceData.clientPan}
                    onChange={(e) => updateInvoiceData("clientPan", e.target.value)}
                    placeholder="Client CR Number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="placeOfSupply">Place of Supply</Label>
                  <Input
                    id="placeOfSupply"
                    value={invoiceData.placeOfSupply}
                    onChange={(e) => updateInvoiceData("placeOfSupply", e.target.value)}
                    placeholder="State/Place"
                  />
                </div>
                <div>
                  <Label htmlFor="countryOfSupply">Country of Supply</Label>
                  <Input
                    id="countryOfSupply"
                    value={invoiceData.countryOfSupply}
                    onChange={(e) => updateInvoiceData("countryOfSupply", e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button onClick={addLineItem} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
      </Button>
    </CardHeader>
            <CardContent className="space-y-4">
              {invoiceData.lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-1">
                    <Label className="text-xs">Item #</Label>
                    <div className="h-10 flex items-center justify-center font-medium text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor={`description-${item.id}`}>Description</Label>
                    <Input
                      id={`description-${item.id}`}
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${item.id}`}>Qty</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`rate-${item.id}`}>Price</Label>
                    <Input
                      id={`rate-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Amount</Label>
                    <div className="h-10 flex items-center">
                      {getCurrencySymbol(invoiceData.secondaryCurrency)}{item.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    {invoiceData.lineItems.length > 1 && (
                      <Button
                        onClick={() => removeLineItem(item.id)}
                        size="sm"
                        variant="ghost"
                        className="p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={invoiceData.bankName}
                    onChange={(e) => updateInvoiceData("bankName", e.target.value)}
                    placeholder="Bank Name"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={invoiceData.accountNumber}
                    onChange={(e) => updateInvoiceData("accountNumber", e.target.value)}
                    placeholder="Account Number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={invoiceData.ifscCode}
                    onChange={(e) => updateInvoiceData("ifscCode", e.target.value)}
                    placeholder="IFSC Code"
                  />
                </div>
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Input
                    id="accountType"
                    value={invoiceData.accountType}
                    onChange={(e) => updateInvoiceData("accountType", e.target.value)}
                    placeholder="Savings/Current"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax and Discount */}
          <Card>
            <CardHeader>
              <CardTitle>Tax & Discount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountRate">Discount (%)</Label>
                  <Input
                    id="discountRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={invoiceData.discountRate}
                    onChange={(e) => updateInvoiceData("discountRate", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">VAT Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={invoiceData.taxRate}
                    onChange={(e) => updateInvoiceData("taxRate", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">VAT rate for Saudi Arabia (typically 15%)</p>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={invoiceData.notes}
                onChange={(e) => updateInvoiceData("notes", e.target.value)}
                placeholder="Additional notes or payment terms..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-6">
          <h2 className="mb-4">Invoice Preview</h2>
          <Card>
            <CardContent className="p-0">
              <div className="invoice-preview bg-white text-black w-full max-w-[210mm] min-h-[297mm] mx-auto">
                {/* Header */}
                <div
                  className="text-white p-6 flex justify-between items-start rounded-t"
                  style={{ backgroundColor: headerColor }}
                >
                  <div>
                    <h1 className="text-3xl font-medium" style={{ color: headerTextColor }}>
                      Invoice
                    </h1>
                  </div>
                  {invoiceData.logo && (
                    <div className="w-8 h-8 bg-white rounded overflow-hidden">
                      <img src={invoiceData.logo} alt="Company logo" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  {/* Invoice Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Invoice Number</div>
                      <div className="font-medium">{invoiceData.invoiceNumber}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Invoice Date</div>
                      <div className="font-medium">
                        {new Date(invoiceData.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Due Date</div>
                      <div className="font-medium">
                        {new Date(invoiceData.dueDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Company and Client Info */}
                  <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                      <div className="font-medium mb-2">Billed by</div>
                      <div className="space-y-1">
                        <div className="font-medium">{invoiceData.companyName}</div>
                        <div className="text-gray-600 whitespace-pre-line">{invoiceData.companyAddress}</div>
                        <div className="mt-2 space-y-1">
                          <div><span className="font-medium">VAT:</span> {invoiceData.gstin}</div>
                          <div><span className="font-medium">CR:</span> {invoiceData.pan}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium mb-2">Billed to</div>
                      <div className="space-y-1">
                        <div className="font-medium">{invoiceData.clientName}</div>
                        <div className="text-gray-600 whitespace-pre-line">{invoiceData.clientAddress}</div>
                        <div className="mt-2 space-y-1">
                          <div><span className="font-medium">VAT:</span> {invoiceData.clientGstin}</div>
                          <div><span className="font-medium">CR:</span> {invoiceData.clientPan}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Place and Country of Supply */}
                  <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                      <span className="font-medium">Place of Supply:</span> {invoiceData.placeOfSupply}
                    </div>
                    <div>
                      <span className="font-medium">Country of Supply:</span> {invoiceData.countryOfSupply}
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-gray-200">
                      <thead>
                        <tr style={{ backgroundColor: tableHeaderColor, color: tableTextColor }}>
                          <th className="text-center p-2 border-r border-gray-200 w-12">Item #</th>
                          <th className="text-center p-2 border-r border-gray-200">Description</th>
                          <th className="text-center p-2 border-r border-gray-200 w-12">Qty.</th>
                          <th className="text-center p-2 border-r border-gray-200 w-16">VAT %</th>
                          <th className="text-center p-2 border-r border-gray-200 w-24">Price</th>
                          <th className="text-center p-2 border-r border-gray-200 w-24">VAT</th>
                          <th className="text-center p-2 w-20">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.lineItems.map((item, index) => (
                          <tr key={item.id} className="border-b border-gray-200">
                            <td className="text-center p-2 border-r border-gray-200">
                              <div className="font-medium">{index + 1}</div>
                            </td>
                            <td className="p-2 border-r border-gray-200 text-center">
                              <div className="font-medium">{item.description}</div>
                            </td>
                            <td className="text-center p-2 border-r border-gray-200">{item.quantity}</td>
                            <td className="text-center p-2 border-r border-gray-200">{invoiceData.taxRate}%</td>
                            <td className="text-center p-2 border-r border-gray-200">
                              {getCurrencySymbol(invoiceData.secondaryCurrency)} {item.rate.toFixed(2)}
                            </td>
                            <td className="text-center p-2 border-r border-gray-200">
                              {getCurrencySymbol(invoiceData.secondaryCurrency)}
                              {((item.amount * invoiceData.taxRate) / 100).toFixed(2)}
                            </td>
                            <td className="text-center p-2">
                              {getCurrencySymbol(invoiceData.secondaryCurrency)}{" "}
                              {(item.amount + (item.amount * invoiceData.taxRate) / 100).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium mb-2">Bank & Payment Details</div>
                        <div className="text-xs space-y-1">
                          <div><span className="font-medium">Account Holder:</span> {invoiceData.companyName}</div>
                          <div><span className="font-medium">Account Number:</span> {invoiceData.accountNumber}</div>
                          <div><span className="font-medium">IFSC Code:</span> {invoiceData.ifscCode}</div>
                          <div><span className="font-medium">Bank:</span> {invoiceData.bankName}</div>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="w-24 h-24 border border-gray-300 rounded overflow-hidden bg-white">
                        {qrCodeDataUrl ? (
                          <img src={qrCodeDataUrl} alt="ZATCA QR Code" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                            Generating QR...
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-[rgba(0,0,0,1)] font-medium mb-2">Terms and Conditions</div>
                        <div className="text-xs space-y-1 text-gray-600">
                          <div>1. Please pay within 10 days from the date of invoice; overdue interest @ 18% will be charged on delayed payments.</div>
                          <div>2. Please quote invoice number when remitting funds.</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[rgba(0,0,0,1)] font-medium mb-2">Additional Notes</div>
                        <div className="text-xs text-gray-600">
                          {invoiceData.notes}
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 pt-4 border-t">
                        <div>For any enquiries, email us on {invoiceData.companyEmail} or call us on</div>
                        <div>{invoiceData.companyPhone}</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Sub Total</span>
                        <span>{getCurrencySymbol(invoiceData.secondaryCurrency)}{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      {invoiceData.discountRate > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount ({invoiceData.discountRate}%)</span>
                          <span>{getCurrencySymbol(invoiceData.secondaryCurrency)}{calculateDiscount().toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Taxable Amount</span>
                        <span>{getCurrencySymbol(invoiceData.secondaryCurrency)}{(calculateSubtotal() - calculateDiscount()).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT ({invoiceData.taxRate}%)</span>
                        <span>{getCurrencySymbol(invoiceData.secondaryCurrency)}{calculateTax().toFixed(2)}</span>
                      </div>
                       <div className="border-t pt-2">
                         <div className="flex justify-between font-bold text-lg">
                           <span>Total (Incl. VAT)</span>
                           <span>{getCurrencySymbol(invoiceData.secondaryCurrency)}{calculateTotal().toFixed(2)}</span>
                         </div>
                         
                         <div className="text-xs mt-2">
                           <div className="font-medium">Invoice Total (in words)</div>
                           <div className="text-gray-600">
                             Forty-Two Thousand Four Hundred And Eighty Riyals Only
                           </div>
                         </div>

                         {/* Signature/Stamp */}
                         <div className="border border-gray-200 p-3 mt-3" style={{ backgroundColor: signatureStampBgColor }}>
                           <div className="text-xs space-y-2">
                             <div className="font-medium text-blue-600">Signature / Stamp</div>
                             {signatureStamp && (
                               <div className="w-30 h-30 border border-gray-300 rounded overflow-hidden bg-white">
                                 <img src={signatureStamp} alt="Signature or stamp" className="w-full h-full object-contain" />
                               </div>
                             )}
                           </div>
                         </div>
                       </div>
                     </div>
                  </div>

                  {/* Issued by */}
                  {invoiceData.issuerName && (
                    <div>
                      <div className="font-medium mb-2">Issued by</div>
                      <div className="text-sm text-gray-600">{invoiceData.issuerName}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
  </Card>
        </div>
      </div>
    </div>
);
}

