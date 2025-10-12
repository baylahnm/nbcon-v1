import { useState, useRef, useEffect } from 'react';
import { Input } from '../../../../../1-HomePage/others/components/ui/input';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { 
  Search, 
  Filter, 
  X, 
  TrendingUp,
  Clock,
  Star,
  Users,
  ChevronDown
} from 'lucide-react';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'course' | 'instructor' | 'category' | 'skill';
  count?: number;
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface CourseSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  placeholder?: string;
}

export function CourseSearch({ onSearch, onFilterChange, placeholder = "Search courses..." }: CourseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search suggestions
  const suggestions: SearchSuggestion[] = [
    { id: '1', title: 'Structural Analysis', type: 'course', count: 24 },
    { id: '2', title: 'Project Management', type: 'course', count: 18 },
    { id: '3', title: 'Dr. Ahmed Al-Rashid', type: 'instructor' },
    { id: '4', title: 'Renewable Energy', type: 'category', count: 12 },
    { id: '5', title: 'AutoCAD', type: 'skill', count: 8 },
    { id: '6', title: 'Building Information Modeling', type: 'skill', count: 15 },
    { id: '7', title: 'Civil Engineering', type: 'category', count: 32 },
    { id: '8', title: 'Sarah Johnson', type: 'instructor' }
  ];

  const filterOptions = {
    level: [
      { id: 'beginner', label: 'Beginner', count: 45 },
      { id: 'intermediate', label: 'Intermediate', count: 32 },
      { id: 'advanced', label: 'Advanced', count: 18 }
    ],
    duration: [
      { id: 'short', label: 'Under 2 hours', count: 28 },
      { id: 'medium', label: '2-10 hours', count: 42 },
      { id: 'long', label: '10+ hours', count: 25 }
    ],
    rating: [
      { id: '4.5+', label: '4.5+ stars', count: 38 },
      { id: '4.0+', label: '4.0+ stars', count: 52 },
      { id: '3.5+', label: '3.5+ stars', count: 67 }
    ],
    price: [
      { id: 'free', label: 'Free', count: 12 },
      { id: 'paid', label: 'Paid', count: 83 },
      { id: 'under-50', label: 'Under $50', count: 45 }
    ]
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowFilters(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleFilterToggle = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    onFilterChange([]);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'course': return <Search className="h-3 w-3" />;
      case 'instructor': return <Users className="h-3 w-3" />;
      case 'category': return <TrendingUp className="h-3 w-3" />;
      case 'skill': return <Star className="h-3 w-3" />;
      default: return <Search className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            className="pl-10 pr-20 h-10"
          />
          <div className="absolute right-2 top-1 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleSearch('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto">
            <CardContent className="p-2">
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                    onClick={() => handleSearch(suggestion.title)}
                  >
                    <div className="text-muted-foreground">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{suggestion.title}</span>
                      {suggestion.count && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {suggestion.count} courses
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Level Filter */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Level</h4>
                <div className="space-y-1">
                  {filterOptions.level.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleFilterToggle(option.id)}
                    >
                      <div className={`w-3 h-3 rounded border ${
                        activeFilters.includes(option.id) 
                          ? 'bg-primary border-primary' 
                          : 'border-border'
                      }`} />
                      <span className="text-xs">{option.label}</span>
                      <span className="text-xs text-muted-foreground">({option.count})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Duration</h4>
                <div className="space-y-1">
                  {filterOptions.duration.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleFilterToggle(option.id)}
                    >
                      <div className={`w-3 h-3 rounded border ${
                        activeFilters.includes(option.id) 
                          ? 'bg-primary border-primary' 
                          : 'border-border'
                      }`} />
                      <span className="text-xs">{option.label}</span>
                      <span className="text-xs text-muted-foreground">({option.count})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Rating</h4>
                <div className="space-y-1">
                  {filterOptions.rating.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleFilterToggle(option.id)}
                    >
                      <div className={`w-3 h-3 rounded border ${
                        activeFilters.includes(option.id) 
                          ? 'bg-primary border-primary' 
                          : 'border-border'
                      }`} />
                      <span className="text-xs">{option.label}</span>
                      <span className="text-xs text-muted-foreground">({option.count})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Price</h4>
                <div className="space-y-1">
                  {filterOptions.price.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleFilterToggle(option.id)}
                    >
                      <div className={`w-3 h-3 rounded border ${
                        activeFilters.includes(option.id) 
                          ? 'bg-primary border-primary' 
                          : 'border-border'
                      }`} />
                      <span className="text-xs">{option.label}</span>
                      <span className="text-xs text-muted-foreground">({option.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Active Filters:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filterId) => (
                    <Badge
                      key={filterId}
                      variant="secondary"
                      className="text-[10px] px-2 py-1 cursor-pointer"
                      onClick={() => handleFilterToggle(filterId)}
                    >
                      {filterId}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
