import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { Alert, AlertDescription } from '@/pages/1-HomePage/others/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

export default function AdminRiskCenterPage() {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  const riskMetrics = {
    highRiskUsers: 12,
    mediumRiskUsers: 45,
    lowRiskUsers: 234,
    totalRiskScore: 7.2
  };

  const riskAlerts = [
    {
      id: 'RISK-001',
      type: 'high',
      title: 'Suspicious Payment Pattern',
      description: 'User John Doe has made 5 payments over $1000 in the last 24 hours',
      user: 'John Doe',
      timestamp: '2024-01-15 14:30',
      status: 'investigating'
    },
    {
      id: 'RISK-002',
      type: 'medium',
      title: 'Unusual Login Activity',
      description: 'User Jane Smith logged in from 3 different countries within 2 hours',
      user: 'Jane Smith',
      timestamp: '2024-01-15 12:15',
      status: 'resolved'
    },
    {
      id: 'RISK-003',
      type: 'high',
      title: 'Failed Payment Attempts',
      description: 'User Mike Johnson has 8 failed payment attempts in the last hour',
      user: 'Mike Johnson',
      timestamp: '2024-01-15 10:45',
      status: 'pending'
    }
  ];

  const riskFactors = [
    {
      factor: 'Payment Velocity',
      score: 8.5,
      description: 'High frequency of large payments',
      impact: 'high'
    },
    {
      factor: 'Geographic Anomaly',
      score: 6.2,
      description: 'Login from unusual locations',
      impact: 'medium'
    },
    {
      factor: 'Account Age',
      score: 3.1,
      description: 'New account with high activity',
      impact: 'low'
    },
    {
      factor: 'Transaction Pattern',
      score: 7.8,
      description: 'Irregular transaction amounts',
      impact: 'high'
    }
  ];

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'investigating': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Risk Management Center</h1>
          <p className="text-gray-600">Monitor and manage platform security risks</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Security Settings
          </Button>
          <Button size="sm">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">High Risk Users</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{riskMetrics.highRiskUsers}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Medium Risk Users</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{riskMetrics.mediumRiskUsers}</div>
            <p className="text-xs text-muted-foreground">Monitor closely</p>
          </CardContent>
        </Card>
        
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Low Risk Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{riskMetrics.lowRiskUsers}</div>
            <p className="text-xs text-muted-foreground">Normal activity</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.totalRiskScore}/10</div>
            <p className="text-xs text-muted-foreground">Platform risk level</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Management Tabs */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="factors">Risk Factors</TabsTrigger>
          <TabsTrigger value="users">User Risk Profiles</TabsTrigger>
          <TabsTrigger value="settings">Risk Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAlerts.map((alert) => (
                  <Alert key={alert.id} className={getRiskColor(alert.type)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(alert.status)}
                          <span className="font-medium">{alert.title}</span>
                          <Badge variant="outline" className={getRiskColor(alert.type)}>
                            {alert.type.toUpperCase()}
                          </Badge>
                        </div>
                        <AlertDescription className="text-sm">
                          {alert.description}
                        </AlertDescription>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                          <span>User: {alert.user}</span>
                          <span>Time: {alert.timestamp}</span>
                          <span>Status: {alert.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          Investigate
                        </Button>
                        <Button size="sm" variant="outline">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Factor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{factor.factor}</span>
                        <Badge variant="outline" className={getRiskColor(factor.impact)}>
                          {factor.impact.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{factor.score}/10</div>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            factor.score >= 7 ? 'bg-red-500' : 
                            factor.score >= 4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(factor.score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Risk Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">User risk profile analysis and management tools.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Management Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Configure risk thresholds and alert settings.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

