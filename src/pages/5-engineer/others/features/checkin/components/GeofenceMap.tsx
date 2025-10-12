import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { 
  Map, 
  MapPin, 
  Navigation, 
  Target,
  Crosshair,
  Radio,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useEffect, useState } from "react";

interface GeofenceMapProps {
  projectName?: string;
  projectCoordinates?: { lat: number; lng: number };
  geofenceRadius?: number; // meters
  currentLocation?: { lat: number; lng: number; accuracy: number } | null;
  isWithinGeofence?: boolean;
}

export function GeofenceMap({ 
  projectName = "Project Site",
  projectCoordinates = { lat: 24.7136, lng: 46.6753 },
  geofenceRadius = 500,
  currentLocation,
  isWithinGeofence = false
}: GeofenceMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setMapLoaded(true), 500);
  }, []);

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

  const distance = currentLocation 
    ? calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        projectCoordinates.lat,
        projectCoordinates.lng
      )
    : 0;

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
            <div className="bg-green-500 h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-base font-bold">Geofence Map</div>
              <p className="text-xs text-muted-foreground mt-0.5">Site boundary visualization</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline"
              className={isWithinGeofence 
                ? "bg-green-500/10 text-green-600 border-green-500/20" 
                : "bg-red-500/10 text-red-600 border-red-500/20"
              }
            >
              <Radio className="w-3 h-3 mr-1" />
              {isWithinGeofence ? "In Range" : "Out of Range"}
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
        {/* Map Placeholder */}
        <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden border-2 border-border">
          {mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Project Site Marker (Center) */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                  <MapPin className="w-10 h-10 text-red-600 drop-shadow-lg" />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-background px-2 py-1 rounded shadow-lg border text-xs font-semibold">
                    {projectName}
                  </div>
                </div>
              </div>

              {/* Geofence Circle */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary/30 bg-primary/10"
                style={{
                  width: `${geofenceRadius / 2}px`,
                  height: `${geofenceRadius / 2}px`
                }}
              />

              {/* Current Location Marker */}
              {currentLocation && (
                <div 
                  className="absolute z-10"
                  style={{
                    top: `${50 + (Math.random() * 30 - 15)}%`,
                    left: `${50 + (Math.random() * 30 - 15)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="relative animate-pulse">
                    <Navigation className="w-8 h-8 text-blue-600 drop-shadow-lg" />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white px-2 py-1 rounded shadow-lg text-xs font-semibold">
                      You
                    </div>
                  </div>
                  {/* Accuracy Circle */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-400/50 bg-blue-400/20 -z-10"
                    style={{
                      width: `${currentLocation.accuracy * 2}px`,
                      height: `${currentLocation.accuracy * 2}px`
                    }}
                  />
                </div>
              )}

              {/* Map Grid Background */}
              <svg className="absolute inset-0 w-full h-full opacity-10">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-12 h-12 text-muted-foreground mx-auto mb-2 animate-pulse" />
                <div className="text-sm text-muted-foreground">Loading map...</div>
              </div>
            </div>
          )}
        </div>

        {/* Distance Info */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="text-lg font-bold text-blue-600">
              {distance > 0 ? Math.round(distance) : '--'}m
            </div>
            <div className="text-xs text-muted-foreground">From Site</div>
          </div>

          <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="text-lg font-bold text-purple-600">
              {geofenceRadius}m
            </div>
            <div className="text-xs text-muted-foreground">Geofence Radius</div>
          </div>

          <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-lg font-bold text-green-600">
              {currentLocation?.accuracy || '--'}m
            </div>
            <div className="text-xs text-muted-foreground">GPS Accuracy</div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Target className="w-4 h-4 mr-2" />
            Center on Site
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Crosshair className="w-4 h-4 mr-2" />
            Center on Me
          </Button>
        </div>

        {/* Legend */}
        <div className="p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
          <div className="font-semibold text-xs text-muted-foreground uppercase">Map Legend</div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Project Site Location</span>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span>Your Current Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary/30 bg-primary/10"></div>
            <span>Geofence Boundary ({geofenceRadius}m radius)</span>
          </div>
        </div>
      </CardContent>
      )}
    </Card>
  );
}

