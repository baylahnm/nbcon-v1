import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign,
  Navigation,
  TrendingUp,
  Home,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

interface TravelData {
  startLocation: string;
  endLocation: string;
  distance: number; // km
  estimatedTime: number; // minutes
  actualTime?: number; // minutes
  travelMethod: "car" | "public" | "motorcycle";
  reimbursementRate: number; // SAR per km
}

interface TravelTimeTrackerProps {
  projectLocation?: string;
  projectCoordinates?: { lat: number; lng: number };
  onStartTracking?: () => void;
}

export function TravelTimeTracker({ 
  projectLocation, 
  projectCoordinates,
  onStartTracking 
}: TravelTimeTrackerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Mock travel data
  const travelData: TravelData = {
    startLocation: "Home - Al Olaya, Riyadh",
    endLocation: projectLocation || "Project Site",
    distance: 23.5,
    estimatedTime: 28,
    actualTime: 32,
    travelMethod: "car",
    reimbursementRate: 0.85 // SAR per km
  };

  const reimbursementAmount = travelData.distance * travelData.reimbursementRate;
  const timeSaved = travelData.estimatedTime - (travelData.actualTime || travelData.estimatedTime);

  const getTravelMethodIcon = () => {
    switch (travelData.travelMethod) {
      case "car":
        return <Car className="w-5 h-5" />;
      case "motorcycle":
        return <Navigation className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  return (
    <Card
      style={{
        border: '2px solid transparent',
        borderRadius: '0.75rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
      className="gap-0"
    >
      <CardHeader className="p-5 pb-3 border-b border-border/40">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-base font-bold">Travel Time Tracker</div>
              <p className="text-xs text-muted-foreground mt-0.5">Track commute and reimbursement</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              {getTravelMethodIcon()}
              <span className="ml-1">{travelData.travelMethod}</span>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {!isCollapsed && (
      <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
        {/* Route Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Home className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Start Location</div>
              <div className="text-sm text-muted-foreground">{travelData.startLocation}</div>
            </div>
          </div>

          <div className="ml-2 border-l-2 border-dashed border-border h-6"></div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Destination</div>
              <div className="text-sm text-muted-foreground">{travelData.endLocation}</div>
            </div>
          </div>
        </div>

        {/* Travel Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-600">
              {travelData.distance}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Distance (km)</div>
          </div>

          <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-600">
              {travelData.actualTime || travelData.estimatedTime}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {travelData.actualTime ? "Actual" : "Est."} Time (min)
            </div>
          </div>

          <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-2xl font-bold text-green-600">
              {reimbursementAmount.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Reimburse (SAR)</div>
          </div>
        </div>

        {/* Reimbursement Calculation */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Distance Traveled</span>
            <span className="font-medium">{travelData.distance} km</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Rate per km</span>
            <span className="font-medium">{travelData.reimbursementRate} SAR</span>
          </div>
          <div className="border-t pt-2 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Total Reimbursement
            </span>
            <span className="text-lg font-bold text-green-600">
              {reimbursementAmount.toFixed(2)} SAR
            </span>
          </div>
        </div>

        {/* Time Comparison */}
        {travelData.actualTime && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Time Variance</span>
            <Badge 
              variant="outline"
              className={timeSaved >= 0 
                ? "bg-green-500/10 text-green-600 border-green-500/20" 
                : "bg-red-500/10 text-red-600 border-red-500/20"
              }
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              {timeSaved >= 0 ? "+" : ""}{Math.abs(timeSaved)} min
            </Badge>
          </div>
        )}

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onStartTracking}
        >
          <Clock className="w-4 h-4 mr-2" />
          Start Travel Tracking
        </Button>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center">
          Travel time is automatically recorded when you check in. Reimbursement is calculated based on company policy.
        </p>
      </CardContent>
      )}
    </Card>
  );
}

