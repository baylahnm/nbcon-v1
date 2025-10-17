import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Input } from "../../../../../1-HomePage/others/components/ui/input";
import { Label } from "../../../../../1-HomePage/others/components/ui/label";
import { Switch } from "../../../../../1-HomePage/others/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../1-HomePage/others/components/ui/select";
import { Separator } from "../../../../../1-HomePage/others/components/ui/separator";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { 
  CreditCard,
  Smartphone,
  Building2,
  Bell,
  Shield,
  FileText,
  Plus,
  Trash2,
  Edit,
  Check,
  AlertTriangle,
  Save
} from "lucide-react";

export function PaymentsSettings() {
  const [notifications, setNotifications] = useState({
    paymentReceived: true,
    invoiceDue: true,
    escrowRelease: true,
    lowBalance: false,
    weeklyReport: true,
    monthlyStatement: true
  });

  const [paymentMethods] = useState([
    {
      id: "pm_001",
      type: "bank_transfer",
      name: "Al Rajhi Bank",
      details: "Account ending in 4567",
      isPrimary: true,
      isVerified: true
    },
    {
      id: "pm_002",
      type: "digital_wallet",
      name: "STC Pay",
      details: "+966 55 123 4567",
      isPrimary: false,
      isVerified: true
    },
    {
      id: "pm_003",
      type: "credit_card",
      name: "Visa Card",
      details: "•••• •••• •••• 1234",
      isPrimary: false,
      isVerified: false
    }
  ]);

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "bank_transfer":
        return <Building2 className="w-5 h-5" />;
      case "digital_wallet":
        return <Smartphone className="w-5 h-5" />;
      case "credit_card":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentMethodColor = (type: string) => {
    switch (type) {
      case "bank_transfer":
        return "bg-info/10 text-info";
      case "digital_wallet":
        return "bg-success/10 text-success";
      case "credit_card":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-sidebar-border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPaymentMethodColor(method.type)}`}>
                  {getPaymentMethodIcon(method.type)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{method.name}</span>
                    {method.isPrimary && (
                      <Badge variant="secondary" className="text-xs">Primary</Badge>
                    )}
                    {method.isVerified ? (
                      <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs bg-warning/10 text-warning">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{method.details}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                {!method.isPrimary && (
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payout Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Payout Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="payout-frequency">Payout Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimum-payout">Minimum Payout Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">SAR</span>
                <Input
                  id="minimum-payout"
                  type="number"
                  defaultValue={1000}
                  className="pl-12"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="payout-day">Payout Day (Weekly)</Label>
              <Select defaultValue="friday">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="SAR">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Tax Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
              <Input
                id="tax-id"
                placeholder="310123456700003"
                defaultValue="310123456700003"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-rate">VAT Rate</Label>
              <Select defaultValue="15">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% (Exempt)</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="15">15% (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business-address">Business Address</Label>
            <Input
              id="business-address"
              placeholder="Enter your registered business address"
              defaultValue="King Fahd Road, Riyadh 12345, Saudi Arabia"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Payment Received</div>
                <div className="text-sm text-muted-foreground">Get notified when payments are received</div>
              </div>
              <Switch
                checked={notifications.paymentReceived}
                onCheckedChange={(value) => handleNotificationChange('paymentReceived', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Invoice Due</div>
                <div className="text-sm text-muted-foreground">Reminders for upcoming invoice due dates</div>
              </div>
              <Switch
                checked={notifications.invoiceDue}
                onCheckedChange={(value) => handleNotificationChange('invoiceDue', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Escrow Release</div>
                <div className="text-sm text-muted-foreground">When escrow payments are released</div>
              </div>
              <Switch
                checked={notifications.escrowRelease}
                onCheckedChange={(value) => handleNotificationChange('escrowRelease', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Low Balance Alert</div>
                <div className="text-sm text-muted-foreground">Alert when account balance is low</div>
              </div>
              <Switch
                checked={notifications.lowBalance}
                onCheckedChange={(value) => handleNotificationChange('lowBalance', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Weekly Report</div>
                <div className="text-sm text-muted-foreground">Weekly payment summary email</div>
              </div>
              <Switch
                checked={notifications.weeklyReport}
                onCheckedChange={(value) => handleNotificationChange('weeklyReport', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Monthly Statement</div>
                <div className="text-sm text-muted-foreground">Monthly payment statement</div>
              </div>
              <Switch
                checked={notifications.monthlyStatement}
                onCheckedChange={(value) => handleNotificationChange('monthlyStatement', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">Add extra security for payment actions</div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Payment Confirmation</div>
                <div className="text-sm text-muted-foreground">Require confirmation for large payments</div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Session Timeout</div>
                <div className="text-sm text-muted-foreground">Auto-logout after inactivity</div>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-32 bg-accent hover:bg-accent hover:text-accent-foreground text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}

