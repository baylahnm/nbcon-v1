import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Widget } from '../types/widget';
import BaseWidget from './BaseWidget';

interface FinancialWidgetProps {
  widget: Widget;
  isEditMode?: boolean;
  onConfigClick?: () => void;
}

export const FinancialWidget: React.FC<FinancialWidgetProps> = ({
  widget,
  isEditMode = false,
  onConfigClick
}) => {
  const config = widget.config;
  const showCharts = config.showCharts !== false;
  const showBreakdown = config.showBreakdown !== false;

  // Mock financial data
  const financialData = {
    monthlyRevenue: "594,900 SAR",
    yearlyRevenue: "5,200,000 SAR",
    growth: "+22%",
    yearlyGrowth: "+27%",
    totalEscrow: "280,000 SAR",
    availableEarnings: "156,750 SAR",
    pendingRelease: "123,250 SAR",
    totalInvoices: 26,
    paidInvoices: 12,
    pendingInvoices: 7,
    overdueInvoices: 3
  };

  const invoiceBreakdown = [
    {
      status: "Paid",
      count: financialData.paidInvoices,
      amount: "324,650 SAR",
      color: "text-success",
      bgColor: "bg-success/10",
      icon: CheckCircle
    },
    {
      status: "Pending",
      count: financialData.pendingInvoices,
      amount: "128,400 SAR",
      color: "text-warning",
      bgColor: "bg-warning/10",
      icon: Clock
    },
    {
      status: "Overdue",
      count: financialData.overdueInvoices,
      amount: "45,200 SAR",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      icon: CreditCard
    }
  ];

  return (
    <BaseWidget
      widget={widget}
      isEditMode={isEditMode}
      onConfigClick={onConfigClick}
      className="h-full"
    >
      <div className="h-full flex flex-col space-y-4">
        {/* Revenue Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-success">{financialData.monthlyRevenue}</div>
              <p className="text-xs text-muted-foreground">This Month</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-xs text-success">{financialData.growth}</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{financialData.availableEarnings}</div>
              <p className="text-xs text-muted-foreground">Available</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <DollarSign className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">Ready to withdraw</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Escrow Breakdown */}
        {showBreakdown && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Escrow Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 border border-sidebar-border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs font-medium">Available</span>
                </div>
                <span className="text-xs font-medium text-success">{financialData.availableEarnings}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 border border-sidebar-border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-xs font-medium">Pending Release</span>
                </div>
                <span className="text-xs font-medium text-warning">{financialData.pendingRelease}</span>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Invoice Status</h4>
          <div className="space-y-2">
            {invoiceBreakdown.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex justify-between items-center p-2 border border-sidebar-border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded ${item.bgColor} flex items-center justify-center`}>
                      <IconComponent className={`w-3 h-3 ${item.color}`} />
                    </div>
                    <div>
                      <span className="text-xs font-medium">{item.status}</span>
                      <p className="text-xs text-muted-foreground">{item.count} invoices</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${item.color}`}>{item.amount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-auto pt-3 border-t border-sidebar-border">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <CreditCard className="w-3 h-3 mr-1" />
              Withdraw
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <DollarSign className="w-3 h-3 mr-1" />
              Invoices
            </Button>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};

export default FinancialWidget;

