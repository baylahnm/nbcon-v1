import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Alert, AlertDescription } from "../../../../../1-HomePage/others/components/ui/alert";
import { Textarea } from "../../../../../1-HomePage/others/components/ui/textarea";
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle,
  Clock,
  FileText,
  XCircle
} from "lucide-react";
import { useState } from "react";

interface MissedCheckIn {
  date: string;
  project: string;
  scheduledTime: string;
  reason?: string;
  status: "pending" | "excused" | "unexcused";
}

interface MissedCheckInAlertsProps {
  missedCheckIns?: MissedCheckIn[];
}

export function MissedCheckInAlerts({ missedCheckIns }: MissedCheckInAlertsProps) {
  const [selectedMissed, setSelectedMissed] = useState<MissedCheckIn | null>(null);
  const [excuse, setExcuse] = useState("");

  // Mock data
  const defaultMissedCheckIns: MissedCheckIn[] = [
    {
      date: "2024-01-10",
      project: "NEOM Smart City Infrastructure",
      scheduledTime: "07:00 AM",
      status: "pending"
    }
  ];

  const missed = missedCheckIns || defaultMissedCheckIns;
  const hasMissed = missed.length > 0;

  const handleSubmitExcuse = () => {
    if (!selectedMissed || !excuse.trim()) return;
    
    console.log("Submitting excuse:", { 
      checkIn: selectedMissed,
      excuse 
    });

    alert("Excuse submitted for review. Your supervisor will be notified.");
    setSelectedMissed(null);
    setExcuse("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case "excused":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Excused
        </Badge>;
      case "unexcused":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
          <XCircle className="w-3 h-3 mr-1" />
          Unexcused
        </Badge>;
      default:
        return null;
    }
  };

  if (!hasMissed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Perfect Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <Award className="w-10 h-10 text-green-600" />
            <div>
              <div className="font-semibold text-green-600">No Missed Check-ins!</div>
              <div className="text-sm text-muted-foreground">
                You've maintained perfect attendance this month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Missed Check-ins
          </div>
          <Badge variant="destructive">
            <Bell className="w-3 h-3 mr-1" />
            {missed.filter(m => m.status === "pending").length} Pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {missed.length} missed check-in{missed.length > 1 ? 's' : ''} that require{missed.length > 1 ? '' : 's'} attention. Please provide a reason.
          </AlertDescription>
        </Alert>

        {/* Missed Check-ins List */}
        <div className="space-y-3">
          {missed.map((item, index) => (
            <div 
              key={index} 
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold">{item.project}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {item.date} at {item.scheduledTime}
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              {item.status === "pending" && (
                <div className="mt-3 space-y-2">
                  {selectedMissed?.date === item.date ? (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Explain the reason for missing this check-in..."
                        value={excuse}
                        onChange={(e) => setExcuse(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={handleSubmitExcuse}
                          disabled={!excuse.trim()}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Submit Excuse
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedMissed(null);
                            setExcuse("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedMissed(item)}
                      className="w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Provide Reason
                    </Button>
                  )}
                </div>
              )}

              {item.reason && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Reason Provided:</div>
                  <div className="text-sm">{item.reason}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Upcoming Schedule Reminder */}
        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-600">Upcoming Schedule</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tomorrow - NEOM Smart City</span>
              <Badge variant="outline" className="text-xs">07:00 AM</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Oct 12 - Aramco Refinery</span>
              <Badge variant="outline" className="text-xs">06:00 AM</Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            💡 You'll receive a reminder 15 minutes before each scheduled check-in
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

