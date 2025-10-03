import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, FileText, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { useQuotations } from '../../hooks/useQuotations';
import { QuotationStats } from '../../types/quotation';
import QuotationTable from './QuotationTable';
import QuotationBuilderDialog from './QuotationBuilderDialog';

const QuotationPage: React.FC = () => {
  const { getQuotationStats } = useQuotations();
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  
  const stats: QuotationStats = getQuotationStats();

  const StatCard = ({ title, value, icon: Icon, description, color = "text-blue-600" }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description: string;
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Create and manage project quotations for your clients
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {/* Export functionality */}}>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button onClick={() => setIsBuilderOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Quotation
          </Button>
        </div>
      </div>


      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
          <CardDescription>Current status of all quotations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              Draft: {stats.draft}
            </Badge>
            <Badge variant="outline" className="gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Sent: {stats.sent}
            </Badge>
            <Badge variant="default" className="gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Accepted: {stats.accepted}
            </Badge>
            <Badge variant="destructive" className="gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Rejected: {stats.rejected}
            </Badge>
            <Badge variant="destructive" className="gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              Expired: {stats.expired}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quotations</CardTitle>
          <CardDescription>
            Manage and track all your quotations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuotationTable />
        </CardContent>
      </Card>

      {/* Quotation Builder Dialog */}
      <QuotationBuilderDialog
        open={isBuilderOpen}
        onOpenChange={setIsBuilderOpen}
      />
    </div>
  );
};

export default QuotationPage;
