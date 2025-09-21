import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  Download,
  Globe,
  Plus
} from 'lucide-react';
import CalendarContent from './CalendarContent';
import CalendarMini from '@/components/calendar/CalendarMini';
import CalendarFilters from '@/components/calendar/CalendarFilters';
import { useCalendarStore, CalendarView, UserRole } from '@/stores/useCalendarStore';
import { useThemeStore } from '@/stores/theme';

export default function CalendarPage() {
  const { 
    showFilters, 
    setShowFilters,
    currentDate,
    setCurrentDate,
    events,
    isHijri,
    userRole,
    setSelectedEvent,
    view,
    setView,
    setUserRole,
    setIsHijri,
    updateFilters
  } = useCalendarStore();

  const { applied: themeTokens } = useThemeStore();

  const [searchTerm, setSearchTerm] = useState('');

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
  };

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateFilters({ searchTerm: value });
  };

  return (
    <div 
      className="h-full flex flex-col"
      style={{
        backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`
      }}
    >
      {/* Header Section */}
      <div 
        className="p-0 mb-4 border-b"
        style={{
          backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
          borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar
            </h1>
            <p className="text-muted-foreground">Manage your engineering projects and milestones</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="text-lg font-medium">
              {formatDate(currentDate)}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Hijri</span>
              <input
                type="checkbox"
                checked={isHijri}
                onChange={(e) => setIsHijri(e.target.checked)}
                className="rounded"
              />
            </div>
            <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={view} onValueChange={(value) => setView(value as CalendarView)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="agenda">Agenda</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              Sync
            </Button>
            <Button size="sm" className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div 
        className="p-0 border-b"
        style={{
          backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
          borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
        }}
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, clients, locations..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select defaultValue="mine">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mine">My Items</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="riyadh">Riyadh</SelectItem>
                <SelectItem value="jeddah">Jeddah</SelectItem>
                <SelectItem value="dammam">Dammam</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Main Area - Calendar Grid */}
        <div 
          className="flex-1 overflow-hidden"
          style={{
            backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`
          }}
        >
          <CalendarContent />
        </div>
        
        {/* Right Sidebar - Mini Calendar */}
        <div 
          className="w-80 p-4 overflow-y-auto border-l"
          style={{
            backgroundColor: `hsl(${themeTokens['--background'] || '0 0% 100%'})`,
            borderColor: `hsl(${themeTokens['--border'] || '0 0% 90%'})`
          }}
        >
          <CalendarMini
            currentDate={currentDate}
            onDateSelect={handleDateSelect}
            events={events}
            isHijri={isHijri}
            userRole={userRole}
            onEventSelect={handleEventSelect}
          />
        </div>
      </div>
      
      {/* Filters Modal */}
      <CalendarFilters 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
      />
    </div>
  );
}
