import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import { KanbanFilters as KanbanFiltersType } from './hooks/useKanbanStore';

interface KanbanFiltersProps {
  filters: KanbanFiltersType;
  onFiltersChange: (filters: KanbanFiltersType) => void;
  availableCategories: string[];
  availableAssignees: Array<{ id: string; name: string; initials: string }>;
}

export function KanbanFiltersDialog({ 
  filters, 
  onFiltersChange, 
  availableCategories, 
  availableAssignees 
}: KanbanFiltersProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<KanbanFiltersType>(filters);

  const priorities = ['High', 'Medium', 'Low'];

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: KanbanFiltersType = {
      categories: [],
      priorities: [],
      assignees: [],
      search: '',
      dateRange: { start: '', end: '' }
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setOpen(false);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      priorities: checked 
        ? [...prev.priorities, priority]
        : prev.priorities.filter(p => p !== priority)
    }));
  };

  const handleAssigneeChange = (assigneeId: string, checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      assignees: checked 
        ? [...prev.assignees, assigneeId]
        : prev.assignees.filter(a => a !== assigneeId)
    }));
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + 
           filters.priorities.length + 
           filters.assignees.length + 
           (filters.search ? 1 : 0) +
           (filters.dateRange.start || filters.dateRange.end ? 1 : 0);
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 relative"
        >
          <Filter className="w-4 h-4" />
          Filter
          {activeFiltersCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Tasks
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Search Tasks
            </Label>
            <Input
              id="search"
              placeholder="Search by title, description..."
              value={localFilters.search}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date" className="text-sm text-muted-foreground">From</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={localFilters.dateRange.start}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-sm text-muted-foreground">To</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={localFilters.dateRange.end}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Engineering Categories
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={localFilters.categories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Priorities */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Priority Level
            </Label>
            <div className="flex gap-4">
              {priorities.map((priority) => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={localFilters.priorities.includes(priority)}
                    onCheckedChange={(checked) => 
                      handlePriorityChange(priority, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`priority-${priority}`}
                    className="text-sm cursor-pointer"
                  >
                    {priority}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Assignees */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Assigned Engineers
            </Label>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {availableAssignees.map((assignee) => (
                <div key={assignee.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`assignee-${assignee.id}`}
                    checked={localFilters.assignees.includes(assignee.id)}
                    onCheckedChange={(checked) => 
                      handleAssigneeChange(assignee.id, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`assignee-${assignee.id}`}
                    className="text-sm cursor-pointer flex items-center gap-2"
                  >
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                      {assignee.initials}
                    </div>
                    {assignee.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Filters</span>
                <Badge variant="secondary">{activeFiltersCount}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.categories.map(category => (
                  <Badge key={category} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {filters.priorities.map(priority => (
                  <Badge key={priority} variant="outline" className="text-xs">
                    {priority} Priority
                  </Badge>
                ))}
                {filters.assignees.map(assigneeId => {
                  const assignee = availableAssignees.find(a => a.id === assigneeId);
                  return assignee ? (
                    <Badge key={assigneeId} variant="outline" className="text-xs">
                      {assignee.name}
                    </Badge>
                  ) : null;
                })}
                {filters.search && (
                  <Badge variant="outline" className="text-xs">
                    Search: "{filters.search}"
                  </Badge>
                )}
                {(filters.dateRange.start || filters.dateRange.end) && (
                  <Badge variant="outline" className="text-xs">
                    Date Range
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={activeFiltersCount === 0}
          >
            Clear All
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
