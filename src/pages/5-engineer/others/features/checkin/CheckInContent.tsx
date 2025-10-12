import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../stores/auth";
import { getUserDisplayName } from "../../../../1-HomePage/others/lib/userUtils";
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
  FileText,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../1-HomePage/others/components/ui/button";
import { Badge } from "../../../../1-HomePage/others/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../1-HomePage/others/components/ui/avatar";
import { Progress } from "../../../../1-HomePage/others/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../1-HomePage/others/components/ui/select";
import { Textarea } from "../../../../1-HomePage/others/components/ui/textarea";
import { Label } from "../../../../1-HomePage/others/components/ui/label";
import { Separator } from "../../../../1-HomePage/others/components/ui/separator";
import { Alert, AlertDescription } from "../../../../1-HomePage/others/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../1-HomePage/others/components/ui/tabs";

// Import new enhancement components
import { WeeklySummary } from "./components/WeeklySummary";
import { ExportReportDialog } from "./components/ExportReportDialog";
import { WeatherWidget } from "./components/WeatherWidget";
import { TravelTimeTracker } from "./components/TravelTimeTracker";
import { GeofenceMap } from "./components/GeofenceMap";
import { OvertimeCalculator } from "./components/OvertimeCalculator";
import { EnhancedPhotoGallery } from "./components/EnhancedPhotoGallery";
import { MissedCheckInAlerts } from "./components/MissedCheckInAlerts";
import { CheckInAnalytics } from "./components/CheckInAnalytics";

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

// Sample data moved inside component to access current user data

export function CheckInContent() {
  const { profile } = useAuthStore();
  const currentUserName = getUserDisplayName(profile);
  
  // Create dynamic sample data with current user info
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
      supervisor: currentUserName,
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
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number, accuracy: number} | null>(null);
  const [isWithinGeofence, setIsWithinGeofence] = useState(false);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isRecentCheckInsCollapsed, setIsRecentCheckInsCollapsed] = useState(false);
  const [safetyChecklist, setSafetyChecklist] = useState({
    ppeWorn: false,
    siteSafetyBriefing: false,
    emergencyExitsIdentified: false,
    equipmentInspected: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("checkin");
  
  // Refs for animated gradient cards
  const currentStatusCardRef = useRef<HTMLDivElement>(null);
  const selectProjectCardRef = useRef<HTMLDivElement>(null);
  const locationStatusCardRef = useRef<HTMLDivElement>(null);

  // Mouse tracking effect for animated gradient borders
  useEffect(() => {
    const setupMouseTracking = (cardRef: React.RefObject<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angle = Math.atan2(y - centerY, x - centerX);
        card.style.setProperty('--rotation', `${angle}rad`);
      };

      card.addEventListener('mousemove', handleMouseMove);
      return () => card.removeEventListener('mousemove', handleMouseMove);
    };

    const cleanup1 = setupMouseTracking(currentStatusCardRef);
    const cleanup2 = setupMouseTracking(selectProjectCardRef);
    const cleanup3 = setupMouseTracking(locationStatusCardRef);

    return () => {
      cleanup1?.();
      cleanup2?.();
      cleanup3?.();
    };
  }, []);

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
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Site Check In
            </h1>
            <p className="text-xs text-muted-foreground">
              Geofenced check-in system for Saudi engineering projects
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowExportDialog(true)}
              className="h-8 text-xs gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Export Report
            </Button>
            <div className="text-right">
              <div className="text-lg font-semibold">{currentTime}</div>
              <div className="text-sm text-muted-foreground">{getCurrentDate()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for organizing different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checkin" className="gap-2">
            <MapPin className="w-4 h-4" />
            Check In
          </TabsTrigger>
          <TabsTrigger value="summary" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="overtime" className="gap-2">
            <Clock className="w-4 h-4" />
            Overtime
          </TabsTrigger>
        </TabsList>

        {/* Check In Tab */}
        <TabsContent value="checkin" className="space-y-4 mt-6">

      {/* Current Status Dashboard */}
      <Card
        ref={currentStatusCardRef}
        className="relative overflow-hidden transition-all duration-300"
        style={{
          '--rotation': '4.2rad',
          border: '2px solid transparent',
          borderRadius: '0.5rem',
          backgroundImage: `
            linear-gradient(hsl(var(--card)), hsl(var(--card))),
            linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
          `,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        } as React.CSSProperties}
      >
        <CardHeader className="p-5 pb-3 border-b border-border/40">
          <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight">
            <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <Clock className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">Current Status</div>
              <p className="text-xs text-muted-foreground mt-0.5 font-normal">Your work session status</p>
            </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Project Selection Card */}
        <Card 
          ref={selectProjectCardRef}
          className="h-full flex flex-col relative overflow-hidden transition-all duration-300"
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <CardHeader className="p-5 pb-3 border-b border-border/40">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-primary h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md">
                <Building className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight">Select Project</div>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">Choose your work site</p>
              </div>
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
        <Card 
          ref={locationStatusCardRef}
          className="h-full flex flex-col relative overflow-hidden transition-all duration-300"
          style={{
            '--rotation': '4.2rad',
            border: '2px solid transparent',
            borderRadius: '0.5rem',
            backgroundImage: `
              linear-gradient(hsl(var(--card)), hsl(var(--card))),
              linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          } as React.CSSProperties}
        >
          <CardHeader className="p-5 pb-3 border-b border-border/40">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-primary h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight">Location Status</div>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">GPS and geofence info</p>
              </div>
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
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardHeader className="p-5 pb-3 border-b border-border/40">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-primary h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-base font-bold tracking-tight">Safety Checklist</div>
                  <Badge 
                    variant={allSafetyItemsChecked ? "default" : "secondary"}
                    className={allSafetyItemsChecked ? "bg-green-600" : ""}
                  >
                    {Object.values(safetyChecklist).filter(Boolean).length}/4 Complete
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">Complete before check-in</p>
              </div>
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

      {/* Enhanced Photo Gallery */}
      {selectedProject && (
        <EnhancedPhotoGallery
          photos={capturedPhotos.map((photo, index) => ({
            id: photo,
            url: photo,
            timestamp: new Date().toLocaleString("en-SA", { timeZone: "Asia/Riyadh" }),
            caption: `Site photo ${index + 1}`,
            category: "during"
          }))}
          onAddPhoto={(photo) => setCapturedPhotos(prev => [...prev, photo.id])}
          onDeletePhoto={(photoId) => setCapturedPhotos(prev => prev.filter(p => p !== photoId))}
        />
      )}

      {/* Check-in Notes */}
      {selectedProject && (
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
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardHeader className="p-5 pb-3 border-b border-border/40">
            <CardTitle className="flex items-center gap-2">
              <div className="bg-primary h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight">Check-in Notes</div>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">Add observations and comments</p>
              </div>
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

      {/* Weather Widget */}
      <WeatherWidget 
        projectLocation={selectedProject?.location}
        coordinates={selectedProject?.coordinates}
      />

      {/* Geofence Map */}
      <GeofenceMap
        projectName={selectedProject?.name}
        projectCoordinates={selectedProject?.coordinates}
        geofenceRadius={selectedProject?.radius}
        currentLocation={currentLocation}
        isWithinGeofence={isWithinGeofence}
      />

      {/* Travel Time Tracker */}
      <TravelTimeTracker
        projectLocation={selectedProject?.location}
        projectCoordinates={selectedProject?.coordinates}
      />

      {/* Missed Check-ins Alert */}
      <MissedCheckInAlerts />

      {/* Recent Check-ins */}
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
              <div className="bg-primary h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-base font-bold">Recent Check-ins</div>
                <p className="text-xs text-muted-foreground mt-0.5">Your recent work history</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsRecentCheckInsCollapsed(!isRecentCheckInsCollapsed)}
            >
              {isRecentCheckInsCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {!isRecentCheckInsCollapsed && (
        <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
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
        )}
      </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4 mt-6">
          <WeeklySummary />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <CheckInAnalytics showStreaks={true} />
        </TabsContent>

        {/* Overtime Tab */}
        <TabsContent value="overtime" className="space-y-4 mt-6">
          <OvertimeCalculator
            checkInTime={checkInTime || undefined}
            checkOutTime={isCheckedIn ? undefined : "15:30"}
            shiftStart={selectedProject?.shiftStart}
            shiftEnd={selectedProject?.shiftEnd}
          />
        </TabsContent>
      </Tabs>

      {/* Export Report Dialog */}
      <ExportReportDialog 
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
      />
    </div>
  );
}


