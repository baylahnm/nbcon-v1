import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle 
} from 'lucide-react';
import { Quotation } from '../../types/quotation';
import { formatCurrency, getStatusVariant, getDaysUntilExpiry, numberToWords } from '../../utils/quotationHelpers';

interface QuotationPreviewProps {
  quotation: Quotation;
  onExport?: () => void;
  onSend?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

const QuotationPreview: React.FC<QuotationPreviewProps> = ({
  quotation,
  onExport,
  onSend,
  onAccept,
  onReject
}) => {
  const daysUntilExpiry = getDaysUntilExpiry(quotation.validUntil);
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry < 0;

  const getStatusIcon = () => {
    switch (quotation.status) {
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'expired':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge variant={getStatusVariant(quotation.status)}>
            {quotation.status.toUpperCase()}
          </Badge>
          {isExpiringSoon && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
              Expires in {daysUntilExpiry} days
            </Badge>
          )}
          {isExpired && (
            <Badge variant="destructive">
              Expired
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          {quotation.status === 'sent' && (
            <>
              <Button variant="outline" onClick={onSend}>
                <Send className="w-4 h-4 mr-2" />
                Resend
              </Button>
              <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button variant="destructive" onClick={onReject}>
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Quotation Document */}
      <div 
        className="bg-white text-black shadow-lg rounded-lg overflow-hidden"
        style={{ minHeight: '297mm' }}
      >
        {/* Header */}
        <div 
          className="text-white p-8 flex justify-between items-start"
          style={{ backgroundColor: quotation.theme.headerColor }}
        >
          <div>
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ color: quotation.theme.headerTextColor }}
            >
              QUOTATION
            </h1>
            <p 
              className="text-lg opacity-90"
              style={{ color: quotation.theme.headerTextColor }}
            >
              {quotation.company.name}
            </p>
          </div>
          <div className="text-right">
            <div 
              className="text-sm opacity-90 mb-1"
              style={{ color: quotation.theme.headerTextColor }}
            >
              Quotation Number
            </div>
            <div 
              className="text-xl font-bold"
              style={{ color: quotation.theme.headerTextColor }}
            >
              {quotation.quotationNumber}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="text-gray-600 mb-1">Date</div>
              <div className="font-medium">{new Date(quotation.date).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Valid Until</div>
              <div className={`font-medium ${isExpiringSoon ? 'text-yellow-600' : isExpired ? 'text-red-600' : ''}`}>
                {new Date(quotation.validUntil).toLocaleDateString()}
              </div>
              {isExpiringSoon && (
                <div className="text-xs text-yellow-600">
                  {daysUntilExpiry} days remaining
                </div>
              )}
              {isExpired && (
                <div className="text-xs text-red-600">Expired</div>
              )}
            </div>
            <div>
              <div className="text-gray-600 mb-1">Currency</div>
              <div className="font-medium">{quotation.currency}</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Prepared By</div>
              <div className="font-medium">{quotation.preparedBy}</div>
            </div>
          </div>

          {/* Company and Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="font-semibold text-lg mb-3" style={{ color: quotation.theme.tableTextColor }}>
                From
              </h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{quotation.company.name}</div>
                <div className="text-gray-600 whitespace-pre-line">{quotation.company.address}</div>
                <div className="text-gray-600">Email: {quotation.company.email}</div>
                <div className="text-gray-600">Phone: {quotation.company.phone}</div>
                {quotation.company.vatNumber && (
                  <div className="text-gray-600">VAT: {quotation.company.vatNumber}</div>
                )}
                {quotation.company.crNumber && (
                  <div className="text-gray-600">CR: {quotation.company.crNumber}</div>
                )}
              </div>
            </div>

            {/* Client Info */}
            <div>
              <h3 className="font-semibold text-lg mb-3" style={{ color: quotation.theme.tableTextColor }}>
                To
              </h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{quotation.client.name}</div>
                <div className="text-gray-600 whitespace-pre-line">{quotation.client.address}</div>
                <div className="text-gray-600">Email: {quotation.client.email}</div>
                <div className="text-gray-600">Phone: {quotation.client.phone}</div>
                {quotation.client.vatNumber && (
                  <div className="text-gray-600">VAT: {quotation.client.vatNumber}</div>
                )}
                {quotation.client.crNumber && (
                  <div className="text-gray-600">CR: {quotation.client.crNumber}</div>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: quotation.theme.tableHeaderColor }}>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-left font-medium text-sm"
                    style={{ color: quotation.theme.tableTextColor }}
                  >
                    #
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-left font-medium text-sm"
                    style={{ color: quotation.theme.tableTextColor }}
                  >
                    Description
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-left font-medium text-sm"
                    style={{ color: quotation.theme.tableTextColor }}
                  >
                    Unit
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-left font-medium text-sm"
                    style={{ color: quotation.theme.tableTextColor }}
                  >
                    Qty
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-left font-medium text-sm"
                    style={{ color: quotation.theme.tableTextColor }}
                  >
                    Unit Price
                  </th>
                  <th 
                    className="border border-gray-300 px-4 py-3 text-left font-medium text-sm"
                    style={{ color: quotation.theme.tableTextColor }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {item.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {item.unit}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {formatCurrency(item.unitPrice, quotation.currency)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm font-medium">
                      {formatCurrency(item.total, quotation.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(quotation.subtotal, quotation.currency)}</span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount:</span>
                  <span>-{formatCurrency(quotation.discount, quotation.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>VAT ({quotation.terms.vatRate || 15}%):</span>
                <span>{formatCurrency(quotation.taxAmount, quotation.currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(quotation.totalAmount, quotation.currency)}</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {numberToWords(quotation.totalAmount)}
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <h3 className="font-semibold text-lg mb-3" style={{ color: quotation.theme.tableTextColor }}>
              Terms & Conditions
            </h3>
            <div className="text-sm space-y-2 text-gray-600">
              <p><strong>Validity:</strong> This quotation is valid for {quotation.terms.validity} days from the date of issue.</p>
              <p><strong>Payment Terms:</strong> {quotation.terms.paymentTerms}</p>
              <p><strong>Delivery:</strong> {quotation.terms.deliveryTerms}</p>
              <p><strong>Warranty:</strong> {quotation.terms.warranty}</p>
              {quotation.terms.conditions.map((condition, index) => (
                <p key={index}><strong>•</strong> {condition}</p>
              ))}
            </div>
          </div>

          {/* Notes */}
          {quotation.notes && (
            <div>
              <h3 className="font-semibold text-lg mb-3" style={{ color: quotation.theme.tableTextColor }}>
                Notes
              </h3>
              <div className="text-sm text-gray-600">
                {quotation.notes}
              </div>
            </div>
          )}

          {/* Acceptance Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div>
              <h4 className="font-medium mb-4" style={{ color: quotation.theme.tableTextColor }}>
                Client Acceptance
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Client Name</Label>
                  <Input placeholder="Client name" className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Signature</Label>
                  <div className="border border-gray-300 h-16 rounded mt-1 flex items-center justify-center overflow-hidden">
                    {quotation.client.signature ? (
                      <img 
                        src={quotation.client.signature} 
                        alt="Client Signature" 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Client Signature</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Date</Label>
                  <Input type="date" className="mt-1" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4" style={{ color: quotation.theme.tableTextColor }}>
                Company Representative
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Representative Name</Label>
                  <Input placeholder="Representative name" className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Signature</Label>
                  <div className="border border-gray-300 h-16 rounded mt-1 flex items-center justify-center overflow-hidden">
                    {quotation.company.signature ? (
                      <img 
                        src={quotation.company.signature} 
                        alt="Company Signature" 
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Company Signature</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Date</Label>
                  <Input type="date" className="mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-4 text-center text-xs text-gray-500 border-t"
          style={{ backgroundColor: quotation.theme.signatureStampBgColor }}
        >
          Thank you for your business! This quotation was generated on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default QuotationPreview;
