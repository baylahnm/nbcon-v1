import { Quotation, QuotationItem, QuotationStatus } from '../types/quotation';

// Generate quotation number
export const generateQuotationNumber = (existingCount: number = 0): string => {
  const year = new Date().getFullYear();
  const count = existingCount + 1;
  return `QUO-${year}-${count.toString().padStart(4, '0')}`;
};

// Generate next quotation number based on existing quotations
export const generateNextQuotationNumber = (existingQuotations: Array<{ quotationNumber: string }>): string => {
  const year = new Date().getFullYear();
  const yearPrefix = `QUO-${year}-`;
  
  // Filter quotations for current year and extract numbers
  const currentYearQuotations = existingQuotations
    .filter(q => q.quotationNumber.startsWith(yearPrefix))
    .map(q => {
      const numberPart = q.quotationNumber.replace(yearPrefix, '');
      const number = parseInt(numberPart);
      return isNaN(number) ? 0 : number;
    });
  
  // Find the highest number and increment by 1
  const maxNumber = currentYearQuotations.length > 0 ? Math.max(...currentYearQuotations) : 0;
  const nextNumber = maxNumber + 1;
  
  return `${yearPrefix}${nextNumber.toString().padStart(4, '0')}`;
};

// Calculate validity date
export const calculateValidUntil = (validityDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + validityDays);
  return date.toISOString().split('T')[0];
};

// Check if quotation is expired
export const isExpired = (validUntil: string): boolean => {
  return new Date(validUntil) < new Date();
};

// Get status variant for UI
export const getStatusVariant = (status: QuotationStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'draft':
      return 'secondary';
    case 'sent':
      return 'outline';
    case 'accepted':
      return 'default';
    case 'rejected':
      return 'destructive';
    case 'expired':
      return 'destructive';
    default:
      return 'secondary';
  }
};

// Get status color
export const getStatusColor = (status: QuotationStatus): string => {
  switch (status) {
    case 'draft':
      return 'text-gray-600';
    case 'sent':
      return 'text-blue-600';
    case 'accepted':
      return 'text-green-600';
    case 'rejected':
      return 'text-red-600';
    case 'expired':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// Calculate item total
export const calculateItemTotal = (item: QuotationItem): number => {
  const subtotal = item.quantity * item.unitPrice;
  const discount = item.discount || 0;
  return subtotal - (subtotal * discount / 100);
};

// Calculate quotation totals
export const calculateQuotationTotals = (items: QuotationItem[], discountRate: number = 0, taxRate: number = 15) => {
  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const discount = subtotal * (discountRate / 100);
  const taxableAmount = subtotal - discount;
  const taxAmount = taxableAmount * (taxRate / 100);
  const totalAmount = taxableAmount + taxAmount;

  return {
    subtotal,
    discount,
    taxableAmount,
    taxAmount,
    totalAmount
  };
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'SAR'): string => {
  return `${currency} ${amount.toFixed(2)}`;
};

// Convert number to words (Saudi Riyals)
export const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  if (num === 0) return 'Zero Riyals Only';
  
  const convertHundreds = (n: number): string => {
    let result = '';
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      n = 0;
    }
    
    if (n > 0) {
      result += ones[n] + ' ';
    }
    
    return result.trim();
  };
  
  const convertThousands = (n: number): string => {
    if (n >= 1000000) {
      return convertHundreds(Math.floor(n / 1000000)) + ' Million ' + convertThousands(n % 1000000);
    } else if (n >= 1000) {
      return convertHundreds(Math.floor(n / 1000)) + ' Thousand ' + convertHundreds(n % 1000);
    } else {
      return convertHundreds(n);
    }
  };
  
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  let result = convertThousands(integerPart) + ' Riyals';
  
  if (decimalPart > 0) {
    result += ' and ' + convertThousands(decimalPart) + ' Halalas';
  }
  
  result += ' Only';
  
  return result;
};

// Get days until expiry
export const getDaysUntilExpiry = (validUntil: string): number => {
  const today = new Date();
  const expiryDate = new Date(validUntil);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if quotation needs attention
export const needsAttention = (quotation: Quotation): boolean => {
  const daysUntilExpiry = getDaysUntilExpiry(quotation.validUntil);
  return quotation.status === 'sent' && daysUntilExpiry <= 7;
};


// Generate quotation email content
export const generateQuotationEmailContent = (quotation: Quotation): { subject: string; body: string } => {
  const subject = `Quotation ${quotation.quotationNumber} - ${quotation.company.name}`;
  const body = `
Dear ${quotation.client.name},

Thank you for your interest in our services. Please find attached the quotation ${quotation.quotationNumber} for your review.

Quotation Details:
- Quotation Number: ${quotation.quotationNumber}
- Date: ${quotation.date}
- Valid Until: ${quotation.validUntil}
- Total Amount: ${formatCurrency(quotation.totalAmount, quotation.currency)}

This quotation is valid for ${quotation.terms.validity} days from the date of issue.

If you have any questions or would like to discuss this quotation, please don't hesitate to contact us.

Best regards,
${quotation.company.name}
${quotation.company.email}
${quotation.company.phone}
  `.trim();

  return { subject, body };
};

// Validate quotation data
export const validateQuotation = (quotation: Partial<Quotation>): string[] => {
  const errors: string[] = [];
  
  if (!quotation.quotationNumber) {
    errors.push('Quotation number is required');
  }
  
  if (!quotation.date) {
    errors.push('Date is required');
  }
  
  if (!quotation.validUntil) {
    errors.push('Valid until date is required');
  }
  
  if (!quotation.client?.name) {
    errors.push('Client name is required');
  }
  
  if (!quotation.company?.name) {
    errors.push('Company name is required');
  }
  
  if (!quotation.items || quotation.items.length === 0) {
    errors.push('At least one item is required');
  }
  
  if (quotation.items) {
    quotation.items.forEach((item, index) => {
      if (!item.description) {
        errors.push(`Item ${index + 1}: Description is required`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
      if (item.unitPrice < 0) {
        errors.push(`Item ${index + 1}: Unit price cannot be negative`);
      }
    });
  }
  
  return errors;
};

// Default quotation theme
export const getDefaultQuotationTheme = (): QuotationTheme => ({
  headerColor: '#705243',
  headerTextColor: '#ffffff',
  tableHeaderColor: '#eeebe8',
  tableTextColor: '#705243',
  signatureStampBgColor: '#f3f4f6'
});

// Default quotation terms
export const getDefaultQuotationTerms = (): QuotationTerms => ({
  validity: 30,
  paymentTerms: '50% advance payment, 50% on completion',
  deliveryTerms: 'Delivery within 30 days of order confirmation',
  warranty: '1 year warranty on all products and services',
  vatRate: 15,
  conditions: [
    'Prices are valid for 30 days from quotation date',
    'Payment terms are as specified above',
    'Any changes to specifications may affect pricing',
    'Warranty terms apply as per company policy'
  ]
});
