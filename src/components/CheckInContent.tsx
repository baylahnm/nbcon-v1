import { useState, useEffect } from "react";
import { 
  MapPin,
  Clock,
  Camera,
  Shield,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Building,
  User,
  Calendar,
  Upload,
  Eye,
  Download,
  RefreshCw,
  Smartphone,
  Wifi,
  Battery,
  Signal,
  Sun,
  Moon,
  Thermometer,
  Wind,
  Droplets,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Project {
  id: string;
  name: string;
  location: string;
  client: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number; // meters
  status: "active" | "completed" | "on-hold";
  safetyLevel: "low" | "medium" | "high";
  shiftStart: string;
  shiftEnd: string;
  supervisor: string;
  emergencyContact: string;
}

interface CheckInData {
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  projectId: string;
  photos: string[];
  notes: string;
  safetyChecklist: {
    ppeWorn: boolean;
    siteSafetyBriefing: boolean;
    emergencyExitsIdentified: boolean;
    equipmentInspected: boolean;
  };
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
  };
}

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "NEOM Smart City Infrastructure Phase 2",
    location: "NEOM, Tabuk Province",
    client: "NEOM Development Company",
    coordinates: { lat: 28.2639, lng: 35.3789 },
    radius: 500,
    status: "active",
    safetyLevel: "high",
    shiftStart: "07:00",
    shiftEnd: "15:00",
    supervisor: "Ahmed Al-Rashid",
    emergencyContact: "+966-11-234-5678"
  },
  {
    id: "2", 
    name: "Aramco Ras Tanura Refinery Expansion",
    location: "Ras Tanura, Eastern Province",
    client: "Saudi Aramco",
    coordinates: { lat: 26.7367, lng: 50.0267 },
    radius: 300,
    status: "active",
    safetyLevel: "high",
    shiftStart: "06:00",
    shiftEnd: "14:00",
    supervisor: "Mohammad Al-Fahad",
    emergencyContact: "+966-13-567-8901"
  },
  {
    id: "3",
    name: "Red Sea Development Marina Infrastructure",
    location: "Red Sea Coast, Tabuk",
    client: "Red Sea Global",
    coordinates: { lat: 22.3964, lng: 39.0403 },
    radius: 400,
    status: "active",
    safetyLevel: "medium",
    shiftStart: "06:30",
    shiftEnd: "14:30",
    supervisor: "Khalid Al-Mutairi",
    emergencyContact: "+966-14-345-6789"
  }
];

export function CheckInContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number, accuracy: number} | null>(null);
  const [isWithinGeofence, setIsWithinGeofence] = useState(false);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [safetyChecklist, setSafetyChecklist] = useState({
    ppeWorn: false,
    siteSafetyBriefing: false,
    emergencyExitsIdentified: false,
    equipmentInspected: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("en-SA", {
        timeZone: "Asia/Riyadh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mock current location (Riyadh for demo)
  useEffect(() => {
    // Simulate getting user location
    setTimeout(() => {
      setCurrentLocation({
        lat: 24.7136,
        lng: 46.6753,
        accuracy: 10
      });
      setLocationPermission("granted");
    }, 1000);
  }, []);

  // Check if user is within geofence when project and location are available
  useEffect(() => {
    if (selectedProject && currentLocation) {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        selectedProject.coordinates.lat,
        selectedProject.coordinates.lng
      );
      setIsWithinGeofence(distance <= selectedProject.radius);
    }
  }, [selectedProject, currentLocation]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const handleCheckIn = async () => {
    if (!selectedProject || !currentLocation || !isWithinGeofence) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsCheckedIn(true);
      setCheckInTime(new Date().toLocaleString("en-SA", {
        timeZone: "Asia/Riyadh",
        year: "numeric",
        month: "2-digit", 
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }));
      setIsLoading(false);
    }, 2000);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    setCapturedPhotos([]);
    setNotes("");
    setSafetyChecklist({
      ppeWorn: false,
      siteSafetyBriefing: false,
      emergencyExitsIdentified: false,
      equipmentInspected: false
    });
  };

  const handlePhotoCapture = () => {
    // Simulate photo capture
    const newPhoto = `photo-${Date.now()}.jpg`;
    setCapturedPhotos(prev => [...prev, newPhoto]);
  };

  const getSafetyLevelColor = (level: string) => {
    switch (level) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground border-sidebar-border";
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-SA", {
      timeZone: "Asia/Riyadh",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const allSafetyItemsChecked = Object.values(safetyChecklist).every(Boolean);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Site Check In
            </h1>
            <p className="text-muted-foreground mt-1">
              Geofenced check-in system for Saudi engineering projects
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{currentTime}</div>
            <div className="text-sm text-muted-foreground">{getCurrentDate()}</div>
          </div>
        </div>
      </div>

      {/* Current Status Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={`text-2xl font-bold ${isCheckedIn ? 'text-success' : 'text-muted-foreground'}`}>
                {isCheckedIn ? 'CHECKED IN' : 'NOT CHECKED IN'}
              </div>
              <p className="text-sm text-muted-foreground">Work Status</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-info">
                {checkInTime ? checkInTime.split(' ')[1] : '--:--:--'}
              </div>
              <p className="text-sm text-muted-foreground">Check-in Time</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={`text-2xl font-bold ${locationPermission === 'granted' ? 'text-success' : 'text-destructive'}`}>
                {locationPermission === 'granted' ? 'ENABLED' : 'DISABLED'}
              </div>
              <p className="text-sm text-muted-foreground">Location Services</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Selection Card */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Select Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            <Select 
              value={selectedProject?.id || ""} 
              onValueChange={(value) => {
                const project = sampleProjects.find(p => p.id === value);
                setSelectedProject(project || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose your assigned project" />
              </SelectTrigger>
              <SelectContent>
                {sampleProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <span>{project.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${getSafetyLevelColor(project.safetyLevel)} border`}
                      >
                        {project.safetyLevel} risk
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedProject && (
              <div className="space-y-3 p-4 bg-muted rounded-lg flex-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{selectedProject.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Client: {selectedProject.client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Shift: {selectedProject.shiftStart} - {selectedProject.shiftEnd}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Supervisor: {selectedProject.supervisor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm">Emergency: {selectedProject.emergencyContact}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Status Card */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            {locationPermission === "denied" && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Location permission is required for geofenced check-in. Please enable location services.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex-1 flex flex-col space-y-4">
              {currentLocation && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Location</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Signal className="w-3 h-3" />
                      {currentLocation.accuracy}m accuracy
                    </Badge>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-mono">
                      Lat: {currentLocation.lat.toFixed(6)}
                    </div>
                    <div className="text-sm font-mono">
                      Lng: {currentLocation.lng.toFixed(6)}
                    </div>
                  </div>

                  {selectedProject && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Geofence Status</span>
                        <Badge 
                          variant={isWithinGeofence ? "default" : "destructive"}
                          className={isWithinGeofence ? "bg-green-600" : ""}
                        >
                          {isWithinGeofence ? "Within Site" : "Outside Site"}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Distance: {selectedProject && currentLocation ? 
                          Math.round(calculateDistance(
                            currentLocation.lat,
                            currentLocation.lng,
                            selectedProject.coordinates.lat,
                            selectedProject.coordinates.lng
                          ))
                        : '--'}m from project site
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-auto">
                <Button variant="outline" className="w-full" disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Checklist */}
      {selectedProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Safety Checklist
              <Badge 
                variant={allSafetyItemsChecked ? "default" : "secondary"}
                className={allSafetyItemsChecked ? "bg-green-600" : ""}
              >
                {Object.values(safetyChecklist).filter(Boolean).length}/4 Complete
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'ppeWorn', label: 'Personal Protective Equipment (PPE) Worn', icon: Shield },
                { key: 'siteSafetyBriefing', label: 'Site Safety Briefing Received', icon: User },
                { key: 'emergencyExitsIdentified', label: 'Emergency Exits Identified', icon: AlertTriangle },
                { key: 'equipmentInspected', label: 'Equipment Pre-Use Inspection', icon: CheckCircle }
              ].map(({ key, label, icon: Icon }) => (
                <div 
                  key={key}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    safetyChecklist[key as keyof typeof safetyChecklist] 
                      ? 'border-success/20 bg-success/10' 
                      : 'border-sidebar-border hover:border-muted-foreground'
                  }`}
                  onClick={() => setSafetyChecklist(prev => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev]
                  }))}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      safetyChecklist[key as keyof typeof safetyChecklist]
                        ? 'bg-green-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {safetyChecklist[key as keyof typeof safetyChecklist] ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Documentation */}
      {selectedProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Photo Documentation
              <Badge variant="secondary">{capturedPhotos.length} Photos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  {capturedPhotos[index] ? (
                    <div className="w-full h-full bg-primary/10 rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                  ) : (
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePhotoCapture} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Capture Site Photo
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Check-in Notes */}
      {selectedProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Check-in Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any relevant notes about site conditions, safety observations, or work plan for today..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      )}

      {/* Check In/Out Actions */}
      <Card>
        <CardContent className="pt-6">
          {!isCheckedIn ? (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
              disabled={!selectedProject || !isWithinGeofence || !allSafetyItemsChecked || isLoading}
              onClick={handleCheckIn}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Checking In...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Check In to Site
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully checked in at {checkInTime}. Your work session is now active.
                </AlertDescription>
              </Alert>
              
              <Button 
                variant="destructive" 
                className="w-full"
                size="lg"
                onClick={handleCheckOut}
              >
                <Clock className="w-5 h-5 mr-2" />
                Check Out from Site
              </Button>
            </div>
          )}

          {!isWithinGeofence && selectedProject && (
            <div className="mt-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You must be within {selectedProject.radius}m of the project site to check in.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {!allSafetyItemsChecked && selectedProject && (
            <div className="mt-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Please complete all safety checklist items before checking in.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Check-ins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "2024-01-15", project: "NEOM Smart City", checkIn: "07:15", checkOut: "15:30", hours: "8.25" },
              { date: "2024-01-14", project: "Aramco Refinery", checkIn: "06:00", checkOut: "14:15", hours: "8.25" },
              { date: "2024-01-13", project: "Red Sea Marina", checkIn: "06:45", checkOut: "14:45", hours: "8.00" }
            ].map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{record.project}</div>
                  <div className="text-sm text-muted-foreground">{record.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{record.checkIn} - {record.checkOut}</div>
                  <div className="text-sm text-muted-foreground">{record.hours} hours</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
