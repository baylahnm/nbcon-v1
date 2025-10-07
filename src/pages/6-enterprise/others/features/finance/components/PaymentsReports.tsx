import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../1-HomePage/others/components/ui/select";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { 
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  Filter,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { usePaymentsStore } from "../store/usePaymentsStore";

const formatCurrency = (amount: number, currency: string = 'SAR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Mock monthly data for Saudi engineering projects
const monthlyData = [
  { month: 'Jan', income: 45000, expenses: 4500, net: 40500 },
  { month: 'Feb', income: 52000, expenses: 5200, net: 46800 },
  { month: 'Mar', income: 38000, expenses: 3800, net: 34200 },
  { month: 'Apr', income: 67000, expenses: 6700, net: 60300 },
  { month: 'May', income: 58000, expenses: 5800, net: 52200 },
  { month: 'Jun', income: 72000, expenses: 7200, net: 64800 },
  { month: 'Jul', income: 89000, expenses: 8900, net: 80100 },
  { month: 'Aug', income: 94000, expenses: 9400, net: 84600 },
  { month: 'Sep', income: 76000, expenses: 7600, net: 68400 },
  { month: 'Oct', income: 85000, expenses: 8500, net: 76500 },
  { month: 'Nov', income: 91000, expenses: 9100, net: 81900 },
  { month: 'Dec', income: 78000, expenses: 7800, net: 70200 }
];

// Payment type distribution
const paymentTypeData = [
  { name: 'Milestones', value: 45, amount: 345000, color: 'hsl(var(--success))' },
  { name: 'Invoices', value: 25, amount: 192000, color: 'hsl(var(--info))' },
  { name: 'Escrow', value: 20, amount: 154000, color: 'hsl(var(--primary))' },
  { name: 'Payouts', value: 10, amount: 77000, color: 'hsl(var(--accent))' }
];

// Client distribution
const topClients = [
  { name: 'NEOM Development', amount: 125000, projects: 3, percentage: 16.2 },
  { name: 'Saudi Aramco', amount: 98000, projects: 2, percentage: 12.7 },
  { name: 'Ministry of Transport', amount: 87000, projects: 4, percentage: 11.3 },
  { name: 'Red Sea Development', amount: 76000, projects: 2, percentage: 9.8 },
  { name: 'Riyadh Metro Company', amount: 65000, projects: 3, percentage: 8.4 }
];

export function PaymentsReports() {
  const { payments, exportPayments } = usePaymentsStore();
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [reportType, setReportType] = useState("income");

  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const averageMonthly = totalIncome / 12;
  const growthRate = ((monthlyData[11].income - monthlyData[0].income) / monthlyData[0].income) * 100;

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income Report</SelectItem>
              <SelectItem value="expenses">Expense Report</SelectItem>
              <SelectItem value="tax">Tax Report</SelectItem>
              <SelectItem value="client">Client Analysis</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportPayments('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportPayments('pdf')}>
            <FileText className="w-4 h-4 mr-2" />
            Generate PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalIncome)}
            </div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{growthRate.toFixed(1)}% from last year
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalExpenses / totalIncome) * 100).toFixed(1)}% of income
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              After platform fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(averageMonthly)}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Income Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `SAR ${value / 1000}k`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Income']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {paymentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {paymentTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `SAR ${value / 1000}k`} />
              <Tooltip 
                formatter={(value, name) => [
                  formatCurrency(value as number), 
                  name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Net'
                ]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="income" fill="hsl(var(--success))" name="income" />
              <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="expenses" />
              <Bar dataKey="net" fill="hsl(var(--info))" name="net" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clients by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-sidebar-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground">{client.projects} projects</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(client.amount)}</div>
                  <div className="text-sm text-muted-foreground">{client.percentage}% of total</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Tax Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Annual Tax Report</div>
                <div className="text-sm text-muted-foreground">Complete tax summary</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Download className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Transaction Export</div>
                <div className="text-sm text-muted-foreground">CSV, Excel formats</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <DollarSign className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Income Statement</div>
                <div className="text-sm text-muted-foreground">Professional format</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
