import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MoreHorizontal,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Send,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useQuotations } from '../../hooks/useQuotations';
import { Quotation, QuotationFilters } from '../../types/quotation';
import { formatCurrency, getStatusVariant, getDaysUntilExpiry, needsAttention } from '../../utils/quotationHelpers';

const QuotationTable: React.FC = () => {
  const { quotations, loading, updateQuotationStatus, deleteQuotation, duplicateQuotation } = useQuotations();
  const [filters, setFilters] = useState<QuotationFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status' | 'client'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort quotations
  const filteredQuotations = quotations
    .filter(quotation => {
      if (searchTerm) {
        return (
          quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quotation.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quotation.company.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'client':
          aValue = a.client.name;
          bValue = b.client.name;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleStatusChange = async (quotation: Quotation, newStatus: Quotation['status']) => {
    try {
      await updateQuotationStatus(quotation.id, newStatus);
    } catch (error) {
      console.error('Failed to update quotation status:', error);
    }
  };

  const handleDelete = async (quotation: Quotation) => {
    if (window.confirm(`Are you sure you want to delete quotation ${quotation.quotationNumber}?`)) {
      try {
        await deleteQuotation(quotation.id);
      } catch (error) {
        console.error('Failed to delete quotation:', error);
      }
    }
  };

  const handleDuplicate = async (quotation: Quotation) => {
    try {
      await duplicateQuotation(quotation.id);
    } catch (error) {
      console.error('Failed to duplicate quotation:', error);
    }
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column: typeof sortBy) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getStatusIcon = (status: Quotation['status']) => {
    switch (status) {
      case 'draft':
        return <Edit className="w-4 h-4" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading quotations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filters.status || 'all'} onValueChange={(value) => 
          setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value }))
        }>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                Date {getSortIcon('date')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('client')}>
                Client {getSortIcon('client')}
              </TableHead>
              <TableHead>Quotation #</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                Amount {getSortIcon('amount')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                Status {getSortIcon('status')}
              </TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotations.map((quotation) => {
              const daysUntilExpiry = getDaysUntilExpiry(quotation.validUntil);
              const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
              const isExpired = daysUntilExpiry < 0;
              
              return (
                <TableRow key={quotation.id} className={needsAttention(quotation) ? 'bg-yellow-50' : ''}>
                  <TableCell>{new Date(quotation.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{quotation.client.name}</div>
                      <div className="text-sm text-muted-foreground">{quotation.client.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{quotation.quotationNumber}</TableCell>
                  <TableCell>
                    <div className={isExpiringSoon ? 'text-yellow-600' : isExpired ? 'text-red-600' : ''}>
                      {new Date(quotation.validUntil).toLocaleDateString()}
                      {isExpiringSoon && (
                        <div className="text-xs text-yellow-600">
                          {daysUntilExpiry} days left
                        </div>
                      )}
                      {isExpired && (
                        <div className="text-xs text-red-600">Expired</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(quotation.totalAmount, quotation.currency)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(quotation.status)}
                      <Badge variant={getStatusVariant(quotation.status)}>
                        {quotation.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(quotation)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Send className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {quotation.status === 'sent' && (
                          <>
                            <DropdownMenuItem onClick={() => handleStatusChange(quotation, 'accepted')}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark as Accepted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(quotation, 'rejected')}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Mark as Rejected
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDelete(quotation)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredQuotations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No quotations found
        </div>
      )}
    </div>
  );
};

export default QuotationTable;
