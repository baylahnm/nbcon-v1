import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../1-HomePage/others/components/ui/card";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Input } from "../../../../../1-HomePage/others/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../../../1-HomePage/others/components/ui/dialog";
import { 
  Bookmark, 
  Bell,
  Trash2,
  Plus,
  Search,
  MapPin,
  DollarSign,
  Briefcase
} from "lucide-react";

interface SavedFilter {
  id: string;
  name: string;
  filters: {
    search?: string;
    category?: string;
    type?: string;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
  };
  alertsEnabled: boolean;
  matchCount: number;
  lastRun: string;
}

interface SavedSearchFiltersProps {
  onApplyFilter?: (filter: SavedFilter) => void;
}

export function SavedSearchFilters({ onApplyFilter }: SavedSearchFiltersProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [filterName, setFilterName] = useState("");

  // Mock saved filters
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    {
      id: "1",
      name: "Structural Engineering in Riyadh",
      filters: {
        category: "Structural Engineering",
        location: "Riyadh",
        salaryMin: 15000
      },
      alertsEnabled: true,
      matchCount: 12,
      lastRun: "2 hours ago"
    },
    {
      id: "2",
      name: "High-paying Contract Jobs",
      filters: {
        type: "contract",
        salaryMin: 20000
      },
      alertsEnabled: false,
      matchCount: 5,
      lastRun: "1 day ago"
    }
  ]);

  const handleSaveFilter = () => {
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: {
        // Get current filter state from parent
        search: "",
        category: "All"
      },
      alertsEnabled: false,
      matchCount: 0,
      lastRun: "Just now"
    };

    setSavedFilters(prev => [...prev, newFilter]);
    setFilterName("");
    setShowDialog(false);
  };

  const handleDeleteFilter = (filterId: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const toggleAlerts = (filterId: string) => {
    setSavedFilters(prev => prev.map(f => 
      f.id === filterId ? { ...f, alertsEnabled: !f.alertsEnabled } : f
    ));
  };

  return (
    <>
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
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-base font-bold">Saved Searches</div>
                <p className="text-xs text-muted-foreground mt-0.5">Quick access to your filters</p>
              </div>
            </div>
            <Button size="sm" onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Save Current
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4 bg-background rounded-b-xl">
          <div className="space-y-3">
            {savedFilters.map((filter) => (
              <div 
                key={filter.id}
                className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{filter.name}</h4>
                      {filter.alertsEnabled && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">
                          <Bell className="w-3 h-3 mr-1" />
                          Alerts On
                        </Badge>
                      )}
                    </div>
                    
                    {/* Filter Summary */}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                      {filter.filters.category && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {filter.filters.category}
                        </span>
                      )}
                      {filter.filters.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {filter.filters.location}
                        </span>
                      )}
                      {filter.filters.salaryMin && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {filter.filters.salaryMin.toLocaleString()}+ SAR
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary" className="text-xs">
                        {filter.matchCount} jobs
                      </Badge>
                      <span className="text-muted-foreground">• Updated {filter.lastRun}</span>
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => toggleAlerts(filter.id)}
                    >
                      <Bell className={`w-4 h-4 ${filter.alertsEnabled ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDeleteFilter(filter.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onApplyFilter?.(filter)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Apply This Filter
                </Button>
              </div>
            ))}

            {savedFilters.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No saved searches yet</p>
                <p className="text-xs">Save your current filters for quick access later</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Filter Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search Filter</DialogTitle>
            <DialogDescription>
              Give this filter a name to quickly access it later
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter Name</label>
              <Input
                placeholder="e.g., Senior Structural Jobs in Riyadh"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>

            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="text-muted-foreground mb-2">Current filters:</p>
              <ul className="space-y-1 text-xs">
                <li>• Category: Structural Engineering</li>
                <li>• Location: Any</li>
                <li>• Type: All Types</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFilter} disabled={!filterName.trim()}>
              <Bookmark className="w-4 h-4 mr-2" />
              Save Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

