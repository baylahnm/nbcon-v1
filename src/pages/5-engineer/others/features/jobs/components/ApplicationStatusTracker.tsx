import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Progress } from "../../../../../1-HomePage/others/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  Eye,
  Send,
  UserCheck,
  MessageSquare,
  Award,
  TrendingUp
} from "lucide-react";

interface ApplicationStage {
  name: string;
  status: "completed" | "current" | "pending";
  date?: string;
  icon: React.ReactNode;
}

interface ApplicationStatusTrackerProps {
  jobTitle: string;
  company: string;
  applicationDate: string;
  currentStage: number; // 0-5
}

export function ApplicationStatusTracker({ 
  jobTitle,
  company,
  applicationDate,
  currentStage = 2
}: ApplicationStatusTrackerProps) {
  const stages: ApplicationStage[] = [
    {
      name: "Application Submitted",
      status: currentStage >= 0 ? "completed" : "pending",
      date: applicationDate,
      icon: <Send className="w-4 h-4" />
    },
    {
      name: "Application Reviewed",
      status: currentStage >= 1 ? "completed" : currentStage === 0 ? "current" : "pending",
      date: currentStage >= 1 ? "Jan 16, 2024" : undefined,
      icon: <Eye className="w-4 h-4" />
    },
    {
      name: "Shortlisted",
      status: currentStage >= 2 ? "completed" : currentStage === 1 ? "current" : "pending",
      date: currentStage >= 2 ? "Jan 18, 2024" : undefined,
      icon: <UserCheck className="w-4 h-4" />
    },
    {
      name: "Interview Scheduled",
      status: currentStage >= 3 ? "completed" : currentStage === 2 ? "current" : "pending",
      date: currentStage >= 3 ? "Jan 20, 2024" : currentStage === 2 ? "Pending" : undefined,
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      name: "Final Review",
      status: currentStage >= 4 ? "completed" : currentStage === 3 ? "current" : "pending",
      date: currentStage >= 4 ? "Jan 25, 2024" : undefined,
      icon: <Clock className="w-4 h-4" />
    },
    {
      name: "Offer Received",
      status: currentStage >= 5 ? "completed" : currentStage === 4 ? "current" : "pending",
      date: currentStage >= 5 ? "Jan 28, 2024" : undefined,
      icon: <Award className="w-4 h-4" />
    }
  ];

  const progressPercentage = (currentStage / (stages.length - 1)) * 100;

  const getStageColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 border-green-500 text-green-600";
      case "current": return "bg-blue-500/10 border-blue-500 text-blue-600";
      default: return "bg-muted border-border text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Application Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Job Info */}
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="font-semibold text-sm mb-1">{jobTitle}</h4>
          <p className="text-xs text-muted-foreground">{company}</p>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">Stage {currentStage + 1} of {stages.length}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Application Stages */}
        <div className="relative space-y-4">
          {/* Progress Line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

          {stages.map((stage, index) => (
            <div key={index} className="relative flex items-start gap-4">
              {/* Stage Icon */}
              <div className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStageColor(stage.status)}`}>
                {stage.icon}
              </div>

              {/* Stage Info */}
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-sm">{stage.name}</h5>
                  {stage.status === "completed" && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {stage.status === "current" && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">
                      In Progress
                    </Badge>
                  )}
                </div>
                {stage.date && (
                  <p className="text-xs text-muted-foreground">{stage.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        {currentStage < stages.length - 1 && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h5 className="font-semibold text-sm text-blue-600 mb-1">Next Step</h5>
            <p className="text-xs text-muted-foreground">
              {currentStage === 2 && "Wait for the client to schedule an interview. You'll be notified via email."}
              {currentStage === 1 && "Your application is being reviewed. Check back in 2-3 days."}
              {currentStage === 0 && "Your application has been submitted successfully."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

