import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Input } from "../../../../../1-HomePage/others/components/ui/input";
import { 
  Map, 
  MapPin, 
  Navigation,
  List,
  Layers,
  Search,
  Target,
  DollarSign
} from "lucide-react";

interface JobLocation {
  id: string;
  title: string;
  company: string;
  location: string;
  coordinates: { lat: number; lng: number };
  salary: { min: number; max: number };
  distance: number; // km from user
  matchScore: number;
}

interface JobsMapViewProps {
  jobs: any[];
  userLocation?: { lat: number; lng: number };
  onJobSelect?: (jobId: string) => void;
}

export function JobsMapView({ 
  jobs,
  userLocation = { lat: 24.7136, lng: 46.6753 }, // Riyadh
  onJobSelect 
}: JobsMapViewProps) {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [radiusFilter, setRadiusFilter] = useState(50); // km

  // Mock job locations
  const jobLocations: JobLocation[] = [
    {
      id: "1",
      title: "Senior Structural Engineer",
      company: "Saudi Aramco",
      location: "Riyadh",
      coordinates: { lat: 24.7136, lng: 46.6753 },
      salary: { min: 15000, max: 25000 },
      distance: 5,
      matchScore: 92
    },
    {
      id: "2",
      title: "Project Manager",
      company: "ACWA Power",
      location: "Jeddah",
      coordinates: { lat: 21.4858, lng: 39.1925 },
      salary: { min: 12000, max: 20000 },
      distance: 950,
      matchScore: 85
    },
    {
      id: "3",
      title: "Electrical Engineer",
      company: "NEOM",
      location: "Tabuk",
      coordinates: { lat: 28.3838, lng: 36.5660 },
      salary: { min: 8000, max: 14000 },
      distance: 1150,
      matchScore: 78
    }
  ];

  const filteredByRadius = jobLocations.filter(job => job.distance <= radiusFilter);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            Jobs Map View
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={viewMode === "map" ? "default" : "outline"}
              onClick={() => setViewMode("map")}
            >
              <Map className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Radius Filter */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">
              Search Radius: {radiusFilter} km
            </label>
            <input 
              type="range" 
              min="10" 
              max="200" 
              step="10"
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <Badge variant="secondary">
            {filteredByRadius.length} jobs
          </Badge>
        </div>

        {/* Map View */}
        {viewMode === "map" && (
          <div className="relative h-[400px] bg-muted rounded-lg border-2 border-border overflow-hidden">
            {/* User Location (Center) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative">
                <Navigation className="w-8 h-8 text-blue-600 drop-shadow-lg" />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white px-2 py-1 rounded shadow-lg text-xs font-semibold">
                  You
                </div>
                {/* Search Radius Circle */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-400/30 bg-blue-400/10 -z-10"
                  style={{
                    width: `${radiusFilter * 2}px`,
                    height: `${radiusFilter * 2}px`
                  }}
                />
              </div>
            </div>

            {/* Job Markers */}
            {filteredByRadius.map((job, index) => (
              <div
                key={job.id}
                className="absolute z-10 cursor-pointer"
                style={{
                  top: `${30 + (index * 15)}%`,
                  left: `${35 + (index * 20)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
              >
                <div className="relative group">
                  <MapPin className={`w-8 h-8 drop-shadow-lg transition-all ${
                    selectedJob === job.id ? 'text-green-600 w-10 h-10' : 'text-red-600 hover:w-9 hover:h-9'
                  }`} />
                  
                  {/* Job Info Popup */}
                  {selectedJob === job.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-background border-2 border-primary rounded-lg shadow-xl p-3 z-30">
                      <div className="space-y-2">
                        <div className="font-semibold text-sm">{job.title}</div>
                        <div className="text-xs text-muted-foreground">{job.company}</div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="bg-green-500/10 text-green-600">
                            {job.matchScore}% match
                          </Badge>
                          <Badge variant="secondary">
                            {job.distance}km away
                          </Badge>
                        </div>
                        <div className="text-sm font-semibold text-green-600">
                          {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} SAR
                        </div>
                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Map Grid Background */}
            <svg className="absolute inset-0 w-full h-full opacity-5">
              <defs>
                <pattern id="job-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#job-grid)" />
            </svg>

            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button size="sm" variant="secondary">
                <Target className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Layers className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-2">
            {filteredByRadius.map((job) => (
              <div 
                key={job.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onJobSelect?.(job.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{job.title}</div>
                    <div className="text-xs text-muted-foreground">{job.company} • {job.location}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs mb-1">
                      {job.distance}km
                    </Badge>
                    <div className="text-xs font-semibold text-green-600">
                      {job.salary.min.toLocaleString()}+ SAR
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map Legend */}
        <div className="p-3 bg-muted/50 rounded-lg space-y-1.5 text-xs">
          <div className="font-semibold text-muted-foreground uppercase text-[10px]">Legend</div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Job Location ({filteredByRadius.length} within {radiusFilter}km)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

