import { useState } from "react";
import { 
  Filter,
  X,
  Check,
  Star,
  Clock,
  Award,
  Languages,
  Building,
  BookOpen,
  Target,
  RotateCcw
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Slider } from "../ui/slider";

interface FilterOptions {
  categories: string[];
  levels: string[];
  languages: { code: string; name: string }[];
  providers: string[];
  duration: { min: number; max: number };
  price: { min: number; max: number };
}

interface ActiveFilters {
  category: string;
  level: string;
  language: string;
  provider: string;
  duration: [number, number];
  price: [number, number];
  hasCertificate: boolean;
  hasHandsOn: boolean;
  cpdEligible: boolean;
  trending: boolean;
  newContent: boolean;
  saudiSpecific: boolean;
  minRating: number;
}

interface LearningFiltersProps {
  options: FilterOptions;
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  resultsCount: number;
}

const defaultFilters: ActiveFilters = {
  category: "all",
  level: "all",
  language: "all",
  provider: "all",
  duration: [0, 1000],
  price: [0, 5000],
  hasCertificate: false,
  hasHandsOn: false,
  cpdEligible: false,
  trending: false,
  newContent: false,
  saudiSpecific: false,
  minRating: 0
};

export function LearningFilters({ options, activeFilters, onFiltersChange, resultsCount }: LearningFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof ActiveFilters, value: string | string[] | number | boolean) => {
    onFiltersChange({
      ...activeFilters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = () => {
    return JSON.stringify(activeFilters) !== JSON.stringify(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category !== "all") count++;
    if (activeFilters.level !== "all") count++;
    if (activeFilters.language !== "all") count++;
    if (activeFilters.provider !== "all") count++;
    if (activeFilters.hasCertificate) count++;
    if (activeFilters.hasHandsOn) count++;
    if (activeFilters.cpdEligible) count++;
    if (activeFilters.trending) count++;
    if (activeFilters.newContent) count++;
    if (activeFilters.saudiSpecific) count++;
    if (activeFilters.minRating > 0) count++;
    return count;
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters() && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-96 sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </SheetTitle>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {resultsCount.toLocaleString()} courses found
          </div>
        </SheetHeader>

        <ScrollArea className="h-full mt-6">
          <div className="space-y-6 pr-4">
            {/* Category */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">Category</Label>
              </div>
              <Select
                value={activeFilters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {options.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Level */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">Level</Label>
              </div>
              <Select
                value={activeFilters.level}
                onValueChange={(value) => handleFilterChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {options.levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Language */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">Language</Label>
              </div>
              <Select
                value={activeFilters.language}
                onValueChange={(value) => handleFilterChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  {options.languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Provider */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">Provider</Label>
              </div>
              <Select
                value={activeFilters.provider}
                onValueChange={(value) => handleFilterChange('provider', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {options.providers.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Rating */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">Minimum Rating</Label>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[activeFilters.minRating]}
                  onValueChange={(value) => handleFilterChange('minRating', value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Any rating</span>
                  <span>{activeFilters.minRating > 0 ? `${activeFilters.minRating}+ stars` : ''}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Duration */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">Duration</Label>
              </div>
              <div className="space-y-2">
                <Slider
                  value={activeFilters.duration}
                  onValueChange={(value) => handleFilterChange('duration', value as [number, number])}
                  max={options.duration.max}
                  min={options.duration.min}
                  step={30}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatDuration(activeFilters.duration[0])}</span>
                  <span>{formatDuration(activeFilters.duration[1])}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 text-muted-foreground font-bold text-sm flex items-center justify-center">
                  ر.س
                </div>
                <Label className="font-medium">Price Range (SAR)</Label>
              </div>
              <div className="space-y-2">
                <Slider
                  value={activeFilters.price}
                  onValueChange={(value) => handleFilterChange('price', value as [number, number])}
                  max={options.price.max}
                  min={options.price.min}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{activeFilters.price[0].toLocaleString()} SAR</span>
                  <span>{activeFilters.price[1].toLocaleString()} SAR</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-muted-foreground" />
                <Label className="font-medium">Features</Label>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certificate"
                    checked={activeFilters.hasCertificate}
                    onCheckedChange={(checked) => handleFilterChange('hasCertificate', checked)}
                  />
                  <Label htmlFor="certificate" className="text-sm">
                    Certificate Available
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hands-on"
                    checked={activeFilters.hasHandsOn}
                    onCheckedChange={(checked) => handleFilterChange('hasHandsOn', checked)}
                  />
                  <Label htmlFor="hands-on" className="text-sm">
                    Hands-on Practice
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cpd"
                    checked={activeFilters.cpdEligible}
                    onCheckedChange={(checked) => handleFilterChange('cpdEligible', checked)}
                  />
                  <Label htmlFor="cpd" className="text-sm">
                    CPD Eligible
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Content Type */}
            <div className="space-y-3">
              <Label className="font-medium">Content Type</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trending"
                    checked={activeFilters.trending}
                    onCheckedChange={(checked) => handleFilterChange('trending', checked)}
                  />
                  <Label htmlFor="trending" className="text-sm">
                    Trending Now
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-content"
                    checked={activeFilters.newContent}
                    onCheckedChange={(checked) => handleFilterChange('newContent', checked)}
                  />
                  <Label htmlFor="new-content" className="text-sm">
                    New Content
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saudi-specific"
                    checked={activeFilters.saudiSpecific}
                    onCheckedChange={(checked) => handleFilterChange('saudiSpecific', checked)}
                  />
                  <Label htmlFor="saudi-specific" className="text-sm">
                    Saudi-Specific
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Apply Button */}
        <div className="mt-6 pt-4 border-t">
          <Button 
            onClick={() => setIsOpen(false)} 
            className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
          >
            Apply Filters ({resultsCount.toLocaleString()} results)
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

